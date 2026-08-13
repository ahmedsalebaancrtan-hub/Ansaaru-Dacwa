package dto

type CreateTeacherDto struct {
	FullName string `json:"fullname" binding:"required"`
	Phone    string `json:"phone" binding:"required,min=9,max=12"` // Supports typical Somali phone length variations
	Email    string `json:"email" binding:"required,email"`
}
type UpdateTeacherDto struct {
	FullName string `json:"fullname" binding:"required"`
	Phone    string `json:"phone" binding:"required,min=9,max=12"`
	Email    string `json:"email" binding:"required,email"`
	IsActive *bool  `json:"is_active" binding:"required"` // Pointer ensures we can bind false values correctly
}
