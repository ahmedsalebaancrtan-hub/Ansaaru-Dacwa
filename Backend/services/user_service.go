package services

import (
	"errors"
	"log/slog"
	"net/http"
	"strings"
	"time"

	"github.com/ahmedsaleban/ansaru_dacwa/constants"
	"github.com/ahmedsaleban/ansaru_dacwa/dto"
	"github.com/ahmedsaleban/ansaru_dacwa/helpers"
	"github.com/ahmedsaleban/ansaru_dacwa/models"
	"github.com/ahmedsaleban/ansaru_dacwa/repository"
	"golang.org/x/crypto/bcrypt"
)

type Userservice struct {
	repo *repository.UserRepo
}

func RegisterService(repo *repository.UserRepo) *Userservice {
	return &Userservice{
		repo: repo,
	}
}

func (svc *Userservice) CreateUser(data *dto.CreateUserDto) (int, error) {

	email := strings.ToLower(data.EmailAddress)
	_, err := svc.repo.GetUserByEmail(email)

	if err == nil {
		slog.Error("User with that email already exists")
		return http.StatusConflict, errors.New("User with this email already exist")

	}

	slog.Info("Hashing user password")

	hashbytes, err := bcrypt.GenerateFromPassword([]byte(data.Password), bcrypt.DefaultCost)
	if err != nil {
		slog.Error("failed to hash a password")
		return http.StatusInternalServerError, errors.New(constants.DefaultErrorMsg)
	}

	data.Password = string(hashbytes)

	slog.Info("Created user")

	err = svc.repo.CreateUser(models.User{
		FullName:     data.FullName,
		EmailAddress: email,
		Password:     data.Password,
		Role:         data.Role,
	})

	if err != nil {
		slog.Error("failed to Created New User", "error", err)
		return http.StatusInternalServerError, errors.New(constants.FailedToCreatedUser)
	}

	slog.Info("Successfully Created User")

	return http.StatusCreated, nil

}

func (svc *Userservice) LoginUser(data dto.LoginUserRequest) (response *dto.LoginUserResponse, StatusCode int, err error) {

	slog.Info("Get User by email")
	email := strings.ToLower(data.EmailAddress)

	user, err := svc.repo.GetUserByEmail(email)
	if err != nil {
		slog.Error("invalid email")
		StatusCode = http.StatusUnauthorized
		err = errors.New(constants.UnUthorisedAccess)

		return
	}

	if err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(data.Password)); err != nil {
		slog.Error("invalid password")
		StatusCode = http.StatusUnauthorized
		err = errors.New(constants.UnUthorisedAccess)
		return

	}

	AccessToken, err := helpers.GenerateJwt(user.Role, user.ID, user.EmailAddress, time.Now().Add(15*time.Minute).Unix(), false)

	if err != nil {
		slog.Error("Failed to Generate access token")
		StatusCode = http.StatusInternalServerError
		err = errors.New(constants.DefaultErrorMsg)

		return
	}
	RefreshToken, err := helpers.GenerateJwt(user.Role, user.ID, user.EmailAddress, time.Now().Add(72*time.Hour).Unix(), true)

	if err != nil {
		slog.Error("Failed to Generate refresh token token")
		StatusCode = http.StatusInternalServerError
		err = errors.New(constants.DefaultErrorMsg)

		return
	}

	return &dto.LoginUserResponse{
		User:         user,
		AccessToken:  AccessToken,
		RefreshToken: RefreshToken,
	}, http.StatusOK, nil
}
func (svc *Userservice) ForgotPassword(data *dto.ForgotPasswordDTO) (int, error) {
	email := strings.ToLower(data.Email)

	_, err := svc.repo.GetUserByEmail(email)
	if err != nil {
		return http.StatusOK, nil // User not found, but we don't tell the client
	}

	otp := helpers.GenerateNumericOTP(6)

	// Save to DB
	reset := models.PasswordResetToken{
		Email:     email,
		Token:     otp,
		ExpiresAt: time.Now().Add(10 * time.Minute),
	}
	svc.repo.SaveResetToken(reset)

	err = helpers.SendOTPEmail(email, otp)
	if err != nil {
		slog.Error("Failed to send email", "error", err)
		return http.StatusInternalServerError, errors.New("failed to send otp email")
	}

	return http.StatusOK, nil
}

func (svc *Userservice) ResetPassword(data *dto.ResetPasswordDTO) (int, error) {
	// 1. Look for the OTP in the PasswordResetToken table (Email OTP)
	record, err := svc.repo.GetResetTokenByEmailAndOTP(data.Email, data.OTP)
	if err != nil {
		return http.StatusBadRequest, errors.New("invalid otp or email")
	}

	if time.Now().After(record.ExpiresAt) {
		return http.StatusBadRequest, errors.New("otp expired")
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(data.NewPassword), bcrypt.DefaultCost)
	if err != nil {
		return http.StatusInternalServerError, err
	}

	user, _ := svc.repo.GetUserByEmail(data.Email)
	if err := svc.repo.UpdatePasswordById(user.ID, string(hash)); err != nil {
		return http.StatusInternalServerError, err
	}

	_ = svc.repo.DeleteResetToken(data.OTP)

	return http.StatusOK, nil
}
func (svc *Userservice) WhoAmI(userID uint) (*dto.UserProfileResponse, int, error) {

	user, err := svc.repo.GetUserByID(userID)
	if err != nil {
		return nil, http.StatusUnauthorized, errors.New("user not found")
	}

	response := &dto.UserProfileResponse{
		FullName:     user.FullName,
		EmailAddress: user.EmailAddress,
		Role:         string(user.Role),
		CreatedAt:    user.CreatedAt,
		UpdatedAt:    user.UpdatedAt,
	}

	return response, http.StatusOK, nil
}

func (svc *Userservice) RefreshToken(email string) (*dto.LoginUserResponse, int, error) {
	user, err := svc.repo.GetUserByEmail(email)
	if err != nil {
		return nil, http.StatusUnauthorized, errors.New(constants.DefaultErrorMsg)
	}

	AccessToken, err := helpers.GenerateJwt(user.Role, user.ID, user.EmailAddress, time.Now().Add(15*time.Minute).Unix(), false)

	if err != nil {
		slog.Error("Failed to Generate access token")
		err = errors.New(constants.DefaultErrorMsg)

	}

	RefreshToken, err := helpers.GenerateJwt(user.Role, user.ID, user.EmailAddress, time.Now().Add(72*time.Hour).Unix(), true)

	if err != nil {
		slog.Error("Failed to Generate refresh token token")
		err = errors.New(constants.DefaultErrorMsg)

	}

	return &dto.LoginUserResponse{
		User:         user,
		AccessToken:  AccessToken,
		RefreshToken: RefreshToken,
	}, http.StatusOK, nil

}
