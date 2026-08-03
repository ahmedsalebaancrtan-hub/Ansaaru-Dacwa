package dto

import "time"

type StudentAttendanceItem struct {
	StudentID uint   `json:"student_id" binding:"required"`
	Status    string `json:"status" binding:"required,oneof=PRESENT ABSENT LATE EXCUSED"`
	Remarks   string `json:"remarks"`
}

type MarkBulkAttendanceDTO struct {
	ClassID     uint                    `json:"class_id" binding:"required"`
	Date        time.Time               `json:"date" binding:"required"`
	Attendances []StudentAttendanceItem `json:"attendances" binding:"required,gt=0,dive"`
}

type AttendanceFilterDTO struct {
	ClassID uint      `form:"class_id"`
	Date    time.Time `form:"date"`
}
