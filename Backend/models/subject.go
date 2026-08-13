package models

import (
	"time"
)

type Subject struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	Name      string    `json:"name" gorm:"not null"`
	Marks     int       `json:"marks" gorm:"not null"`
	ClassID   uint      `json:"class_id" gorm:"not null"`
	Class     Class     `json:"class,omitempty" gorm:"foreignKey:ClassID;constraint:OnDelete:CASCADE;"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
