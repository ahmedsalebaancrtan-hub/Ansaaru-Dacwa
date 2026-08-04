package models

import "time"

type PaymentMethod string

const (
	PayMethodCash PaymentMethod = "CASH"
	PayMethodZaad PaymentMethod = "ZAAD"
	PayMethodEvc  PaymentMethod = "EVC"
	PayMethodBank PaymentMethod = "BANK"
)

// Mushaharka bishii la bixiyo
type SalaryPayment struct {
	ID            uint          `json:"id" gorm:"primaryKey"`
	EmployeeID    uint          `json:"employee_id" gorm:"not null;index"`
	Employee      Employee      `json:"employee" gorm:"foreignKey:EmployeeID"`
	Month         string        `json:"month" gorm:"type:varchar(20);not null"` // e.g. "2026-08"
	BaseSalary    float64       `json:"base_salary" gorm:"not null"`
	Bonus         float64       `json:"bonus" gorm:"default:0"`
	Deduction     float64       `json:"deduction" gorm:"default:0"`
	NetSalary     float64       `json:"net_salary" gorm:"not null"` // (Base + Bonus) - Deduction
	PaymentMethod PaymentMethod `json:"payment_method" gorm:"type:varchar(20);not null"`
	Remarks       string        `json:"remarks"`
	PaidAt        time.Time     `json:"paid_at"`
	CreatedAt     time.Time     `json:"created_at"`
	UpdatedAt     time.Time     `json:"updated_at"`
}
