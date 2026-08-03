package services

import (
	"errors"
	"log/slog"
	"net/http"

	"github.com/ahmedsaleban/ansaru_dacwa/constants"
	"github.com/ahmedsaleban/ansaru_dacwa/dto"
	"github.com/ahmedsaleban/ansaru_dacwa/models"
	"github.com/ahmedsaleban/ansaru_dacwa/repository"
	"gorm.io/gorm"
)

type EmployeeService struct {
	EmployeeRepo *repository.EmployeeRepo
}

func NewEmployeeService(repo *repository.EmployeeRepo) *EmployeeService {
	return &EmployeeService{
		EmployeeRepo: repo,
	}
}

func (svc *EmployeeService) CreateEmployee(data dto.CreateEmployeeDto) (int, error) {
	newEmployee := models.Employee{
		FullName:      data.FullName,
		Phone:         data.Phone,
		Role:          data.Role,
		PictureURL:    data.PictureURL,
		DateOfJoining: data.DateOfJoining,
		MonthlySalary: data.MonthlySalary,
		IsActive:      true,
	}

	err := svc.EmployeeRepo.CreateEmployee(newEmployee)
	if err != nil {
		slog.Error("❌ Failed to register new employee", "error", err)
		return http.StatusInternalServerError, errors.New(constants.DefaultErrorMsg)
	}

	return http.StatusCreated, nil
}

func (svc *EmployeeService) GetAllEmployees() ([]models.Employee, int, error) {
	employees, err := svc.EmployeeRepo.GetAllEmployees()
	if err != nil {
		slog.Error("❌ Failed to fetch employees list", "error", err)
		return nil, http.StatusInternalServerError, errors.New(constants.DefaultErrorMsg)
	}
	return employees, http.StatusOK, nil
}

func (svc *EmployeeService) GetEmployeeByPhone(phone string) (models.Employee, int, error) {
	employee, err := svc.EmployeeRepo.GetEmployeeByPhone(phone)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return models.Employee{}, http.StatusNotFound, errors.New("employee not found with this phone number")
		}
		slog.Error("❌ Database error finding employee", "phone", phone, "error", err)
		return models.Employee{}, http.StatusInternalServerError, errors.New(constants.DefaultErrorMsg)
	}
	return employee, http.StatusOK, nil
}

func (svc *EmployeeService) UpdateEmployee(id uint, data dto.UpdateEmployeeDto) (int, error) {
	existing, err := svc.EmployeeRepo.GetEmployeeByID(id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return http.StatusNotFound, errors.New("employee record missing")
		}
		return http.StatusInternalServerError, errors.New(constants.DefaultErrorMsg)
	}

	existing.FullName = data.FullName
	existing.Phone = data.Phone
	existing.Role = data.Role
	existing.PictureURL = data.PictureURL
	existing.DateOfJoining = data.DateOfJoining
	existing.MonthlySalary = data.MonthlySalary
	existing.IsActive = *data.IsActive

	err = svc.EmployeeRepo.UpdateEmployee(existing)
	if err != nil {
		slog.Error("❌ Failed to update employee", "id", id, "error", err)
		return http.StatusInternalServerError, errors.New(constants.DefaultErrorMsg)
	}

	return http.StatusOK, nil
}
