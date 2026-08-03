package repository

import (
	"github.com/ahmedsaleban/ansaru_dacwa/models"
	"gorm.io/gorm"
)

type EmployeeRepo struct {
	DB *gorm.DB
}

func NewEmployeeRepo(db *gorm.DB) *EmployeeRepo {
	return &EmployeeRepo{
		DB: db,
	}
}

func (r *EmployeeRepo) CreateEmployee(data models.Employee) error {
	return r.DB.Create(&data).Error
}

func (r *EmployeeRepo) GetEmployeeByID(id uint) (models.Employee, error) {
	var employee models.Employee
	err := r.DB.First(&employee, id).Error
	return employee, err
}

func (r *EmployeeRepo) GetAllEmployees() ([]models.Employee, error) {
	var employees []models.Employee
	err := r.DB.Find(&employees).Error
	return employees, err
}

func (r *EmployeeRepo) GetEmployeeByPhone(phone string) (models.Employee, error) {
	var employee models.Employee
	err := r.DB.Where("phone = ?", phone).First(&employee).Error
	return employee, err
}

func (r *EmployeeRepo) UpdateEmployee(employee models.Employee) error {
	return r.DB.Save(&employee).Error
}

func (r *EmployeeRepo) DeleteEmployee(id uint) error {
	return r.DB.Delete(&models.Employee{}, id).Error
}
