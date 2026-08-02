package dto

type SubjectItemDto struct {
	Name  string `json:"name" binding:"required"`
	Marks int    `json:"marks" binding:"required"`
}

type AssignSubjectsDTO struct {
	ClassID  uint             `json:"class_id" binding:"required"`
	Subjects []SubjectItemDto `json:"subjects" binding:"required,gt=0,dive"`
}

type UpdateSubjectDTO struct {
	Name  string `json:"name" binding:"required"`
	Marks int    `json:"marks" binding:"required"`
}
