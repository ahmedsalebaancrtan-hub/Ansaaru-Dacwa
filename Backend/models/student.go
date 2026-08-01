package models

import (
	"time"
)

type Student struct {
	ID              uint      `json:"id" gorm:"primaryKey"`
	StudentCode     string    `json:"student_code" gorm:"unique;not null"`
	FullName        string    `json:"full_name" gorm:"not null"`
	Picture         string    `json:"picture,omitempty"` // Optional
	ClassID         uint      `json:"class_id" gorm:"not null"`
	Class           Class     `json:"class,omitempty" gorm:"foreignKey:ClassID"`
	DateOfAdmission time.Time `json:"date_of_admission"`
	DiscountFee     *float64  `json:"discount_fee,omitempty"`  // Optional (Pointer: allows nil/null)
	MobileNumber    string    `json:"mobile_number,omitempty"` // Optional
	FamilyID        uint      `json:"family_id" gorm:"not null"`
	Family          Family    `json:"family,omitempty" gorm:"foreignKey:FamilyID"`
	CreatedAt       time.Time `json:"created_at"`
	UpdatedAt       time.Time `json:"updated_at"`
}
