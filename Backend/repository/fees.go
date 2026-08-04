package repository

import (
	"github.com/ahmedsaleban/ansaru_dacwa/models"
	"gorm.io/gorm"
)

type PaymentRepo struct {
	DB *gorm.DB
}

func NewPaymentRepo(db *gorm.DB) *PaymentRepo {
	return &PaymentRepo{DB: db}
}

func (r *PaymentRepo) CreatePayment(payment *models.StudentPayment) error {
	return r.DB.Create(payment).Error
}

func (r *PaymentRepo) GetPaymentsByStudentID(studentID uint) ([]models.StudentPayment, error) {
	var payments []models.StudentPayment
	err := r.DB.
		Preload("Student").
		Preload("Student.Class").
		Preload("Student.Family").
		Where("student_id = ?", studentID).
		Order("created_at desc").
		Find(&payments).Error
	return payments, err
}

func (r *PaymentRepo) GetAllPayments() ([]models.StudentPayment, error) {
	var payments []models.StudentPayment
	err := r.DB.Preload("Student").
		Order("created_at desc").
		Find(&payments).Error
	return payments, err
}
func (r *PaymentRepo) IsMonthAlreadyPaid(studentID uint, monthFor string) (bool, error) {
	var count int64
	err := r.DB.Model(&models.StudentPayment{}).
		Where("student_id = ? AND month_for = ? AND status = ?", studentID, monthFor, models.PaymentStatusPaid).
		Count(&count).Error
	return count > 0, err
}
