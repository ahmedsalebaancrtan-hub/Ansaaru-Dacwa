package dto

import "time"

type CreatePaymentDTO struct {
	StudentID     uint    `json:"student_id" binding:"required"`
	AmountPaid    float64 `json:"amount_paid" binding:"required,gt=0"`
	MonthFor      string  `json:"month_for" binding:"required"`
	PaymentMethod string  `json:"payment_method" binding:"required"`
	Note          string  `json:"note"`
}
type UnpaidReminderDTO struct {
	Month string `json:"month" binding:"required"` // e.g. "2026-08"
}
type AbsentAlertDTO struct {
	ClassID uint      `json:"class_id" binding:"required"`
	Date    time.Time `json:"date" binding:"required"`
}
