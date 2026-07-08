package dto

import "github.com/ahmedsaleban/ansaru_dacwa/models"

type CreateUserDto struct {
	FullName     string      `json:"fullname" binding:"required"`
	EmailAddress string      `json:"emailaddress" binding:"required"`
	Password     string      `json:"password" binding:"required,min=8,max=128"`
	Role         models.Role `json:"role" binding:"required,oneof=ADMIN STUDENT_AFFAIRS CASHIER"`
}
