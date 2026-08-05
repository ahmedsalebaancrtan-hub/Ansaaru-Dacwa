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

func (svc *PaymentService) ProcessPaymentAndSendReceipt(studentID uint, amount float64, monthFor string, method string) (string, error) {
	// 1. Generate Receipt Number
	receiptNo := fmt.Sprintf("REC-%d", time.Now().Unix())

	// 2. Fetch Student & Family Info
	type StudentDetails struct {
		FullName       string
		ParentOnePhone string
	}
	var details StudentDetails

	err := svc.repo.DB.Raw(`
		SELECT s.full_name, f.parent_one_phone 
		FROM students s
		JOIN families f ON s.family_id = f.id
		WHERE s.id = ?
	`, studentID).Scan(&details).Error

	if err != nil {
		return "", fmt.Errorf("student not found: %v", err)
	}

	// 3. Save to student_payments table
	err = svc.repo.DB.Exec(`
		INSERT INTO student_payments (receipt_no, student_id, amount_paid, month_for, payment_method, status, created_at, updated_at)
		VALUES (?, ?, ?, ?, ?, 'PAID', NOW(), NOW())
	`, receiptNo, studentID, amount, monthFor, method).Error

	if err != nil {
		return "", fmt.Errorf("failed to save payment: %v", err)
	}

	// 4. Send WhatsApp Receipt Asynchronously
	if strings.TrimSpace(details.ParentOnePhone) != "" {
		go func() {
			msg := fmt.Sprintf(
				"🧾 *RISIDHKA LACAG BIXINTA*\n\n"+
					"Asc Waalid, Waxaa nidaamka lagu diwaan-geliyay lacag bixintii Dugsiga Ansaaru Dacwa:\n\n"+
					"👤 *Ardayga:* %s\n"+
					"📅 *Bisha:* %s\n"+
					"💵 *Lacagta:* $%.2f\n"+
					"💳 *Qaabka:* %s\n"+
					"🔢 *Risidh No:* %s\n\n"+
					"Mahadsanid! Waxaan kuu reynaynaa horumar.",
				details.FullName, monthFor, amount, method, receiptNo,
			)
			_ = helpers.SendWhatsAppMessage(details.ParentOnePhone, msg)
		}()
	}

	return receiptNo, nil
}
