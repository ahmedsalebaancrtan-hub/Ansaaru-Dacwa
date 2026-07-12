package models

import "time"

type Family struct {
	ID             uint      `json:"id"`
	FamilyName     string    `json:"familyName"`
	ParentOneName  string    `json:"Parent_one_Name"`
	ParentOnePhone string    `json:"parent_one_phone" gorm:"unique"`
	ParentTwoName  string    `json:"Parent_two_name"`
	ParentTwoPhone string    `json:"Parent_two_phone"`
	Address        string    `json:"address"`
	CreatedAt      time.Time `json:"Createdat"`
	UpdatedAt      time.Time `json:"UpdatedAt"`
}
