package dto

type CreateFamilydto struct {
	FamilyName     string `json:"familyName" binding:"required"`
	ParentOneName  string `json:"Parent_one_Name" binding:"required"`
	ParentOnePhone string `json:"parent_one_phone" binding:"required,min=9,max=128"`
	ParentTwoName  string `json:"Parent_two_name" binding:"required"`
	ParentTwoPhone string `json:"Parent_two_phone" binding:"required,min=9,max=128"`
	Address        string `json:"address" binding:"required"`
}
