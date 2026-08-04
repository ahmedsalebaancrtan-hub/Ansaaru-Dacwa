package repository

import (
	"github.com/ahmedsaleban/ansaru_dacwa/models"
	"gorm.io/gorm"
)

type PayrollRepo struct {
	DB *gorm.DB
}

func NewPayrollRepo(db *gorm.DB) *PayrollRepo {
	return &PayrollRepo{DB: db}
}

func (r *PayrollRepo) IsSalaryPaid(employeeID uint, month string) (bool, error) {
	var count int64
	err := r.DB.Model(&models.SalaryPayment{}).
		Where("employee_id = ? AND month = ?", employeeID, month).
		Count(&count).Error
	return count > 0, err
}

func (r *PayrollRepo) CreateSalaryPayment(payment *models.SalaryPayment) error {
	return r.DB.Create(payment).Error
}

func (r *PayrollRepo) GetSalaryHistory(employeeID uint) ([]models.SalaryPayment, error) {
	var payments []models.SalaryPayment
	query := r.DB.Preload("Employee")
	if employeeID > 0 {
		query = query.Where("employee_id = ?", employeeID)
	}
	err := query.Order("created_at desc").Find(&payments).Error
	return payments, err
}
