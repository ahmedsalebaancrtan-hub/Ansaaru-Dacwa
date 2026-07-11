package dto

type CreateStudentDto struct {
	FirstName      string `json:"first_name" binding:"required"`
	MiddleName     string `json:"middle_name" binding:"required"`
	LastName       string `json:"last_name" binding:"required"`
	StudentCode    string `json:"student_code" binding:"required"`
	FamilyName     string `json:"family_name" binding:"required"`
	ParentOneName  string `json:"parent_one_name" binding:"required"`
	ParentOnePhone string `json:"parent_one_phone" binding:"required"`
	Gender         string `json:"gender" binding:"required"`
}
