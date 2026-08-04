package dto

type CreatePaymentDTO struct {
	StudentID     uint    `json:"student_id" binding:"required"`
	AmountPaid    float64 `json:"amount_paid" binding:"required,gt=0"`
	MonthFor      string  `json:"month_for" binding:"required"`
	PaymentMethod string  `json:"payment_method" binding:"required"`
	Note          string  `json:"note"`
}
