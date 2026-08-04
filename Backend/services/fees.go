package services

import (
	"errors"
	"fmt"
	"log/slog"
	"net/http"
	"time"

	"github.com/ahmedsaleban/ansaru_dacwa/constants"
	"github.com/ahmedsaleban/ansaru_dacwa/dto"
	"github.com/ahmedsaleban/ansaru_dacwa/models"
	"github.com/ahmedsaleban/ansaru_dacwa/repository"
)

type PaymentService struct {
	repo        *repository.PaymentRepo
	studentRepo *repository.StudentRepo
}

func NewPaymentService(repo *repository.PaymentRepo, studentRepo *repository.StudentRepo) *PaymentService {
	return &PaymentService{
		repo:        repo,
		studentRepo: studentRepo,
	}
}
func (svc *PaymentService) ProcessPayment(data dto.CreatePaymentDTO) (models.StudentPayment, int, error) {

	student, err := svc.studentRepo.GetStudentByID(data.StudentID)
	if err != nil {
		return models.StudentPayment{}, http.StatusNotFound, errors.New("student record not found")
	}
	alreadyPaid, err := svc.repo.IsMonthAlreadyPaid(data.StudentID, data.MonthFor)
	if err != nil {
		slog.Error("❌ Error checking existing payment", "error", err)
		return models.StudentPayment{}, http.StatusInternalServerError, errors.New(constants.DefaultErrorMsg)
	}

	if alreadyPaid {
		return models.StudentPayment{}, http.StatusBadRequest, fmt.Errorf("ardaygu mar hore wuxuu bixiyay lacagta bisha %s", data.MonthFor)
	}

	receiptNo := fmt.Sprintf("REC-%s-%d", time.Now().Format("200601021504"), student.ID)

	var autoDiscount float64 = 0.0
	if student.DiscountFee != nil {
		autoDiscount = *student.DiscountFee
	}
	payment := models.StudentPayment{
		ReceiptNo:     receiptNo,
		StudentID:     data.StudentID,
		AmountPaid:    data.AmountPaid,
		Discount:      autoDiscount, // <-- Auto-applied here
		MonthFor:      data.MonthFor,
		PaymentMethod: data.PaymentMethod,
		Status:        models.PaymentStatusPaid,
		Note:          data.Note,
	}

	err = svc.repo.CreatePayment(&payment)
	if err != nil {
		slog.Error("❌ Failed to process student payment", "error", err)
		return models.StudentPayment{}, http.StatusInternalServerError, errors.New(constants.DefaultErrorMsg)
	}
	payment.Student = student
	return payment, http.StatusCreated, nil
}

func (svc *PaymentService) GetStudentPayments(studentID uint) ([]models.StudentPayment, int, error) {
	payments, err := svc.repo.GetPaymentsByStudentID(studentID)
	if err != nil {
		return nil, http.StatusInternalServerError, errors.New(constants.DefaultErrorMsg)
	}
	return payments, http.StatusOK, nil
}
