package dto

import "time"

type CreateEmployeeDto struct {
	FullName      string    `json:"full_name" binding:"required"`
	Phone         string    `json:"phone" binding:"required,min=9,max=15"`
	Role          string    `json:"role" binding:"required"`
	PictureURL    string    `json:"picture_url"`
	DateOfJoining time.Time `json:"date_of_joining" binding:"required"`
	MonthlySalary float64   `json:"monthly_salary" binding:"required,gt=0"`
}

type UpdateEmployeeDto struct {
	FullName      string    `json:"full_name" binding:"required"`
	Phone         string    `json:"phone" binding:"required,min=9,max=15"`
	Role          string    `json:"role" binding:"required"`
	PictureURL    string    `json:"picture_url"`
	DateOfJoining time.Time `json:"date_of_joining" binding:"required"`
	MonthlySalary float64   `json:"monthly_salary" binding:"required,gt=0"`
	IsActive      *bool     `json:"is_active" binding:"required"`
}
