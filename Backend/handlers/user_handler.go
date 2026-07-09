package handlers

import (
	"log/slog"
	"net/http"

	"github.com/ahmedsaleban/ansaru_dacwa/dto"
	"github.com/ahmedsaleban/ansaru_dacwa/infra"
	"github.com/ahmedsaleban/ansaru_dacwa/repository"
	"github.com/ahmedsaleban/ansaru_dacwa/services"
	"github.com/gin-gonic/gin"
)

type UserHandler struct {
	Userservice services.Userservice
}

func RegisterUserHandler() *UserHandler {
	UserRepo := repository.RegisterRepo(infra.DB)
	usersvc := services.RegisterService(UserRepo)

	return &UserHandler{
		Userservice: *usersvc,
	}
}

func (h *UserHandler) CreateUser(c *gin.Context) {
	var RequestBody dto.CreateUserDto
	err := c.ShouldBindBodyWithJSON(&RequestBody)

	if err != nil {

		c.JSON(http.StatusBadRequest, gin.H{
			"messege":    "failed to Bind  body request",
			"is_success": false,
			"error":      err.Error(),
		})
		return
	}

	StatusCode, err := h.Userservice.CreateUser(&RequestBody)

	if err != nil {
		c.JSON(StatusCode, gin.H{
			"is_success": false,
			"messege":    err.Error(),
		})
		return
	}

	c.JSON(StatusCode, gin.H{
		"is_sucess": true,
		"messege":   "User Created sucessfully!",
	})
}

func (h *UserHandler) LoginUser(c *gin.Context) {
	var RequestBody dto.LoginUserRequest
	err := c.ShouldBindBodyWithJSON(&RequestBody)

	if err != nil {

		c.JSON(http.StatusBadRequest, gin.H{
			"messege":    "failed to Bind  body request",
			"is_success": false,
		})
		return
	}

	resp, StatusCode, err := h.Userservice.LoginUser(RequestBody)

	if err != nil {
		c.JSON(StatusCode, gin.H{
			"is_success": false,
			"messege":    err.Error(),
		})
		return
	}

	c.JSON(StatusCode, gin.H{
		"is_sucess": true,
		"messege":   "User Login sucessfully!",
		"data":      resp,
	})
}
func (h *UserHandler) ForgotPassword(c *gin.Context) {
	var body dto.ForgotPasswordDTO
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	status, _ := h.Userservice.ForgotPassword(&body)
	c.JSON(status, gin.H{"message": "If email exists, an OTP has been sent."})
}
func (h *UserHandler) WhoAmI(c *gin.Context) {

	userID := c.GetUint("user_id")

	user, statusCode, err := h.Userservice.WhoAmI(userID)
	if err != nil {
		c.JSON(statusCode, gin.H{
			"is_success": false,
			"message":    err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"is_success": true,
		"message":    "User fetched successfully",
		"data":       user,
	})
}
func (h *UserHandler) ResetPassword(c *gin.Context) {
	var body dto.ResetPasswordDTO
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 🔥 IMPORTANT: Call the Email OTP version, not the 2FA version
	status, err := h.Userservice.ResetPassword(&body)
	if err != nil {
		c.JSON(status, gin.H{"message": err.Error()})
		return
	}

	c.JSON(status, gin.H{"message": "Password updated successfully using Email OTP"})
}
func (h *UserHandler) RefreshToken(c *gin.Context) {
	email := c.GetString("user_email")
	slog.Info("Refresh Email", "email", email)

	if email == "" {
		c.JSON(http.StatusUnauthorized, gin.H{
			"message":    "Email missing from token",
			"is_success": false,
		})
		return
	}
	response, StatusCode, err := h.Userservice.RefreshToken(email)

	if err != nil {
		slog.Info("failed to refresh token", "error", err.Error())

		c.JSON(http.StatusUnauthorized, gin.H{
			"message":    "Unauthorized",
			"is_success": false,
			"data":       nil,
		})
		return
	}

	c.JSON(StatusCode, gin.H{
		"message":    "User refreshed successfully!",
		"is_success": true,
		"data":       response,
	})
}
