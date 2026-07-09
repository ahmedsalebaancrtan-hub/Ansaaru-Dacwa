package repository

import (
	"errors"

	"github.com/ahmedsaleban/ansaru_dacwa/models"
	"gorm.io/gorm"
)

type UserRepo struct {
	DB *gorm.DB
}

func RegisterRepo(db *gorm.DB) *UserRepo {
	return &UserRepo{
		DB: db,
	}
}

func (repo *UserRepo) CreateUser(data models.User) error {
	return repo.DB.Create(&data).Error
}

func (repo *UserRepo) GetUserByEmail(email string) (models.User, error) {

	var user models.User

	err := repo.DB.Where("email_address = ?", email).First(&user).Error

	if err != nil {
		return models.User{}, err
	}
	return user, nil
}
func (repo *UserRepo) GetUserByID(id uint) (*models.User, error) {
	var user models.User

	err := repo.DB.First(&user, id).Error
	if err != nil {
		return nil, err
	}

	return &user, nil
}

func (r *UserRepo) GetResetTokenByEmailAndOTP(email string, otp string) (models.PasswordResetToken, error) {
	var record models.PasswordResetToken

	err := r.DB.Where("email = ? AND token = ?", email, otp).First(&record).Error
	return record, err
}

func (r *UserRepo) UpdatePasswordById(id uint, hashedpassword string) error {
	result := r.DB.Model(&models.User{}).Where("id = ?", id).Update("password", hashedpassword)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return errors.New("user not found")
	}
	return nil
}

func (r *UserRepo) DeleteResetToken(token string) error {
	return r.DB.Where("token = ?", token).Delete(&models.PasswordResetToken{}).Error
}

func (r *UserRepo) SaveResetToken(data models.PasswordResetToken) error {

	r.DB.Where("email = ?", data.Email).Delete(&models.PasswordResetToken{})
	return r.DB.Create(&data).Error
}
func (r *UserRepo) GetAllusers() ([]models.User, error) {
	var users []models.User
	err := r.DB.Find(&users).Error
	return users, err
}
