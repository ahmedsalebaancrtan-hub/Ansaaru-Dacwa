package models

import (
	"time"
)

type Class struct {
	ID           uint      `json:"id"`
	Title        string    `json:"title"`
	AcademicYear string    `json:"AcademicYear"`
	CreatedAt    time.Time `json:"Createdat"`
	UpdatedAt    time.Time `json:"UpdatedAt"`
}
