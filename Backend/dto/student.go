package dto

type CreateStudentDto struct {
	FirstName      string `json:"first_name" binding:"required"`
	MiddleName     string `json:"middle_name" binding:"required"`
	LastName       string `json:"last_name" binding:"required"`
	StudentCode    string `json:"student_code" binding:"required"`
	FamilyID       uint   `json:"family_id" binding:"required"`
	Gender         string `json:"gender" binding:"required"`
}
