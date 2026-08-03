package models

import "time"

type Employee struct {
	ID            uint      `json:"id" gorm:"primaryKey"`
	FullName      string    `json:"full_name" gorm:"not null"`
	Phone         string    `json:"phone" gorm:"unique;not null;index"`
	Role          string    `json:"role" gorm:"not null"` // Principal, Teacher, Accountant, etc.
	PictureURL    string    `json:"picture_url"`
	DateOfJoining time.Time `json:"date_of_joining" gorm:"not null"`
	MonthlySalary float64   `json:"monthly_salary" gorm:"not null"`
	IsActive      bool      `json:"is_active" gorm:"default:true"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
}
