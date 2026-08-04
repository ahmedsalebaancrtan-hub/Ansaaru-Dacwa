package models

import "time"

type PaymentStatus string

const (
	PaymentStatusPaid    PaymentStatus = "PAID"
	PaymentStatusPending PaymentStatus = "PENDING"
	PaymentStatusPartial PaymentStatus = "PARTIAL"
)

type StudentPayment struct {
	ID            uint          `json:"id" gorm:"primaryKey"`
	ReceiptNo     string        `json:"receipt_no" gorm:"unique;not null;index"`
	StudentID     uint          `json:"student_id" gorm:"not null;index"`
	Student       Student       `json:"student" gorm:"foreignKey:StudentID"`
	AmountPaid    float64       `json:"amount_paid" gorm:"not null"`
	Discount      float64       `json:"discount" gorm:"default:0"`
	MonthFor      string        `json:"month_for" gorm:"not null"`      // e.g., "August 2026"
	PaymentMethod string        `json:"payment_method" gorm:"not null"` // e.g., "Zaad", "eDahab", "Cash"
	Status        PaymentStatus `json:"status" gorm:"type:varchar(20);default:'PAID'"`
	Note          string        `json:"note"`
	CreatedAt     time.Time     `json:"created_at"`
	UpdatedAt     time.Time     `json:"updated_at"`
}
