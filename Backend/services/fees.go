package services

import (
	"errors"
	"fmt"
	"log/slog"
	"net/http"
	"strings"
	"time"

	"github.com/ahmedsaleban/ansaru_dacwa/constants"
	"github.com/ahmedsaleban/ansaru_dacwa/dto"
	"github.com/ahmedsaleban/ansaru_dacwa/helpers"
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

// 🟢 1. Marka Lacagta La Bixiyo (Payment Receipt)
func (svc *PaymentService) SendUnpaidReminders(month string) (int, error) {
	type UnpaidResult struct {
		FullName       string
		ParentOnePhone string
	}

	var results []UnpaidResult

	// Haddii input-ku yahay "2026-08", ka dhig "August 2026" si uu DB-ga ugu taxluqo
	formattedMonth := month
	parsedTime, err := time.Parse("2006-01", month)
	if err == nil {
		formattedMonth = parsedTime.Format("January 2006") // e.g. "August 2026"
	}

	// SQL Query - Wuxuu raadinayaa midka input-ka ahaa ama kan loo beddelay "August 2026"
	err = svc.repo.DB.Raw(`
		SELECT s.full_name, f.parent_one_phone 
		FROM students s
		JOIN families f ON s.family_id = f.id
		WHERE s.id NOT IN (
			SELECT student_id 
			FROM student_payments 
			WHERE LOWER(TRIM(month_for)) = LOWER(TRIM(?)) OR LOWER(TRIM(month_for)) = LOWER(TRIM(?))
		)
	`, month, formattedMonth).Scan(&results).Error

	if err != nil {
		return 0, errors.New("failed to fetch unpaid students: " + err.Error())
	}

	fmt.Printf("\n🔍 Ardayda deynta lagu leeyahay bisha %s (%s): %d\n", month, formattedMonth, len(results))

	count := 0
	for _, item := range results {
		phone := strings.TrimSpace(item.ParentOnePhone)
		if phone != "" {
			fmt.Printf("👤 Arday: %s | Phone: %s\n", item.FullName, phone)

			msg := fmt.Sprintf(
				"Asc Waalid, Waxaa lagugu xusuusinayaa in lacagtii dugsiga ee bisha (%s) ee ardayga %s ay wali dhiman tahay. Fadlan kusoo bixi intaan la gaadhin bish 5teeda. Mahadsanid!",
				formattedMonth, item.FullName,
			)

			errMsg := helpers.SendWhatsAppMessage(phone, msg)
			if errMsg != nil {
				fmt.Printf("❌ WhatsApp Error (%s): %v\n", phone, errMsg)
			} else {
				fmt.Printf("✅ WhatsApp Fariintu waa baxday: %s\n", phone)
				count++ // 🟢 Halkan ayaan ku saxnay count++ si uu u tiriyo kuwa saxda ah
			}
		}
	}

	return count, nil
}
