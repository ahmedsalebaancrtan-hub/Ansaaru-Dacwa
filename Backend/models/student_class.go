package models

import "time"

type StudentClass struct {
	ID        uint      `json:"id"`
	StudentID uint      `json:"student_id"`
	ClassID   uint      `json:"class_id"`
	Is_active bool      `json:"is_active"`
	Class     Class     `json:"Class" gorm:"foreignkey:ClassID"`
	Student   Student   `json:"Student" gorm:"foreignkey:StudentID"`
	CreatedAt time.Time `json:"Createdat"`
	UpdatedAT time.Time `json:"updatedAt"`
}
