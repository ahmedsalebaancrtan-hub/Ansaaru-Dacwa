package services

import (
	"errors"
	"net/http"
	"time"

	"github.com/ahmedsaleban/ansaru_dacwa/dto"
	"github.com/ahmedsaleban/ansaru_dacwa/models"
	"github.com/ahmedsaleban/ansaru_dacwa/repository"
)

type PayrollService struct {
	repo *repository.PayrollRepo
}

func NewPayrollService(repo *repository.PayrollRepo) *PayrollService {
	return &PayrollService{repo: repo}
}

func (svc *PayrollService) PaySalary(data dto.PaySalaryDTO) (models.SalaryPayment, int, error) {
	// 1. Hubi in mushaharka bishan hore loo siiyay
	isPaid, err := svc.repo.IsSalaryPaid(data.EmployeeID, data.Month)
	if err != nil {
		return models.SalaryPayment{}, http.StatusInternalServerError, errors.New("fashil markii la xaqiijinayay taariikhda mushaharka")
	}
	if isPaid {
		return models.SalaryPayment{}, http.StatusBadRequest, errors.New("shaqaalahan hore ayaa loogu bixiyay mushaharka bishan")
	}

	// 2. Xisaabi Net Salary
	netSalary := (data.BaseSalary + data.Bonus) - data.Deduction
	if netSalary < 0 {
		return models.SalaryPayment{}, http.StatusBadRequest, errors.New("mushaharka saafiga ah (Net Salary) ma noqon karo eber ka yar")
	}

	payment := models.SalaryPayment{
		EmployeeID:    data.EmployeeID,
		Month:         data.Month,
		BaseSalary:    data.BaseSalary,
		Bonus:         data.Bonus,
		Deduction:     data.Deduction,
		NetSalary:     netSalary,
		PaymentMethod: models.PaymentMethod(data.PaymentMethod),
		Remarks:       data.Remarks,
		PaidAt:        time.Now(),
	}

	err = svc.repo.CreateSalaryPayment(&payment)
	if err != nil {
		return models.SalaryPayment{}, http.StatusInternalServerError, errors.New("laguma guuleysan in la keydiyo bixinta mushaharka")
	}

	return payment, http.StatusCreated, nil
}

func (svc *PayrollService) GetHistory(employeeID uint) ([]models.SalaryPayment, int, error) {
	payments, err := svc.repo.GetSalaryHistory(employeeID)
	if err != nil {
		return nil, http.StatusInternalServerError, errors.New("fashil markii la soo xambaarayay taariikhda mushaharka")
	}
	return payments, http.StatusOK, nil
}
