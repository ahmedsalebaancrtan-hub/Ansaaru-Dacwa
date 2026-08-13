package dto

type AddStudentClassDto struct {
	StudentID uint `json:"student_id" binding:"required"`
	ClassID   uint `json:"class_id" binding:"required"`
}
