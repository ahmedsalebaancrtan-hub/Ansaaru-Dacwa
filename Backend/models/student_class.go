package models

import "time"

type StudentClass struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	StudentID uint      `json:"student_id" gorm:"not null"`
	ClassID   uint      `json:"class_id" gorm:"not null"`
	IsActive  bool      `json:"is_active" gorm:"default:true"`
	Class     Class     `json:"class,omitempty" gorm:"foreignKey:ClassID"`
	Student   Student   `json:"student,omitempty" gorm:"foreignKey:StudentID"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
