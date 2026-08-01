package dto

type CreateStudentDto struct {
	FullName        string   `form:"full_name" json:"full_name" binding:"required"`
	StudentCode     string   `form:"student_code" json:"student_code" binding:"required"`
	ClassID         uint     `form:"class_id" json:"class_id" binding:"required"`
	DateOfAdmission string   `form:"date_of_admission" json:"date_of_admission" binding:"required"`
	DiscountFee     *float64 `form:"discount_fee" json:"discount_fee"`   // Optional
	MobileNumber    string   `form:"mobile_number" json:"mobile_number"` // Optional
	FamilyID        uint     `form:"family_id" json:"family_id" binding:"required"`
}

type UpdateStudentDto struct {
	FullName        string   `form:"full_name" json:"full_name" binding:"required"`
	ClassID         uint     `form:"class_id" json:"class_id" binding:"required"`
	DateOfAdmission string   `form:"date_of_admission" json:"date_of_admission" binding:"required"`
	DiscountFee     *float64 `form:"discount_fee" json:"discount_fee"`   // Optional
	MobileNumber    string   `form:"mobile_number" json:"mobile_number"` // Optional
	FamilyID        uint     `form:"family_id" json:"family_id" binding:"required"`
}
