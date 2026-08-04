package dto

type PaySalaryDTO struct {
	EmployeeID    uint    `json:"employee_id" binding:"required"`
	Month         string  `json:"month" binding:"required"` // e.g. "2026-08"
	BaseSalary    float64 `json:"base_salary" binding:"required,gt=0"`
	Bonus         float64 `json:"bonus" binding:"gte=0"`
	Deduction     float64 `json:"deduction" binding:"gte=0"`
	PaymentMethod string  `json:"payment_method" binding:"required"`
	Remarks       string  `json:"remarks"`
}
