package dto

import (
	"time"

	"github.com/ahmedsaleban/ansaru_dacwa/models"
)

type CreateUserDto struct {
	FullName     string      `json:"fullname" binding:"required"`
	EmailAddress string      `json:"emailaddress" binding:"required"`
	Password     string      `json:"password" binding:"required,min=8,max=128"`
	Role         models.Role `json:"role" binding:"required,oneof=ADMIN STUDENT_AFFAIRS CASHIER"`
}

type LoginUserRequest struct {
	EmailAddress string `json:"emailaddress" binding:"required"`
	Password     string `json:"password" binding:"required,min=8,max=128"`
}
type UserProfileResponse struct {
	FullName     string    `json:"fullname"`
	EmailAddress string    `json:"emailaddress"`
	Role         string    `json:"role"`
	CreatedAt    time.Time `json:"created_at"`
	LastLogin    time.Time `json:"last_login"`
	UpdatedAt    time.Time `json:"updated_at"`
	DeletedAt    time.Time `json:"deleted_at"`
}
type LoginUserResponse struct {
	AccessToken  string      `json:"Access_token"`
	RefreshToken string      `json:"Refresh_token"`
	User         models.User `json:"User"`
}
