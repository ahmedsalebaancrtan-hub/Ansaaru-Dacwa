package models

import "time"

type Role string

const (
	RoleAdmin          Role = "ADMIN"
	RoleStudentAffairs Role = "StudentAffairs"
	RoleCashier        Role = "Cashier"
)

type User struct {
	ID           uint      `json:"id"`
	FullName     string    `json:"fullname"`
	EmailAddress string    `json:"emailaddress"`
	Password     string    `json:"-"`
	Role         Role      `json:"role"`
	CreatedAt    time.Time `json:"Createdat"`
	UpdatedAt    time.Time `json:"Updatedat"`
	DeletedAt    time.Time `json:"DeletedAt"`
}
