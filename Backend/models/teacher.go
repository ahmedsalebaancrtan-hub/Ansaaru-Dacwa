package models

import "time"

type Teacher struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	FullName  string    `json:"fullname" gorm:"not null"`
	Phone     string    `json:"phone" gorm:"unique;not null;index"`
	Email     string    `json:"email" gorm:"unique;not null"`
	IsActive  bool      `json:"is_active" gorm:"default:true"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
