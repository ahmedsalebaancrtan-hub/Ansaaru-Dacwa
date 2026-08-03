package models

import "time"

type AttendanceStatus string

const (
	StatusPresent AttendanceStatus = "PRESENT"
	StatusAbsent  AttendanceStatus = "ABSENT"
	StatusLate    AttendanceStatus = "LATE"
	StatusExcused AttendanceStatus = "EXCUSED"
)

type Attendance struct {
	ID        uint             `json:"id" gorm:"primaryKey"`
	StudentID uint             `json:"student_id" gorm:"not null;index"`
	Student   Student          `json:"student" gorm:"foreignKey:StudentID"`
	ClassID   uint             `json:"class_id" gorm:"not null;index"`
	Class     Class            `json:"class" gorm:"foreignKey:ClassID"`
	Date      time.Time        `json:"date" gorm:"type:date;not null;index"`
	Status    AttendanceStatus `json:"status" gorm:"type:varchar(20);not null"`
	Remarks   string           `json:"remarks"` // Faahfaahin dheeraad ah (sida sababta uu u maqnaa)
	CreatedAt time.Time        `json:"created_at"`
	UpdatedAt time.Time        `json:"updated_at"`
}
