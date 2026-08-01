package dto

// SubjectItem represents an individual subject field in the form
type SubjectItem struct {
	Name  string `json:"name" binding:"required"`
	Marks int    `json:"marks" binding:"required,min=1"`
}

// AssignSubjectsDTO handles multi-subject assignment to a class
type AssignSubjectsDTO struct {
	ClassID  uint          `json:"class_id" binding:"required"`
	Subjects []SubjectItem `json:"subjects" binding:"required,gt=0,dive"`
}

type UpdateSubjectDTO struct {
	Name  string `json:"name" binding:"required"`
	Marks int    `json:"marks" binding:"required,min=1"`
}
