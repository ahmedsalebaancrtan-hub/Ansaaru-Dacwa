package handlers

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/ahmedsaleban/ansaru_dacwa/dto"
	"github.com/ahmedsaleban/ansaru_dacwa/infra"
	"github.com/ahmedsaleban/ansaru_dacwa/repository"
	"github.com/ahmedsaleban/ansaru_dacwa/services"
	"github.com/gin-gonic/gin"
)

type PaymentHandler struct {
	svc *services.PaymentService
}

func RegisterPaymentHandler() *PaymentHandler {
	repo := repository.NewPaymentRepo(infra.DB)
	studentRepo := repository.NewStudentRepo(infra.DB)
	svc := services.NewPaymentService(repo, studentRepo)

	return &PaymentHandler{svc: svc}
}

func (h *PaymentHandler) ProcessPayment(c *gin.Context) {
	var body dto.CreatePaymentDTO
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"is_success": false,
			"message":    "Invalid payment request payload",
			"error":      err.Error(),
		})
		return
	}

	payment, status, err := h.svc.ProcessPayment(body)
	if err != nil {
		c.JSON(status, gin.H{"is_success": false, "message": err.Error()})
		return
	}

	c.JSON(status, gin.H{
		"is_success": true,
		"message":    "Payment processed successfully",
		"data":       payment,
	})
}

// 🟢 ProcessPaymentAndSendReceipt - Wuxuu diwaan-gelinayaa lacagta wuxuuna waalidka u dirayaa Risidh WhatsApp ah
func (h *PaymentHandler) ProcessPaymentAndSendReceipt(c *gin.Context) {
	var body dto.CreatePaymentDTO
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"is_success": false,
			"message":    "Invalid payment receipt payload",
			"error":      err.Error(),
		})
		return
	}

	receiptNo, err := h.svc.ProcessPaymentAndSendReceipt(
		body.StudentID,
		body.AmountPaid,
		body.MonthFor,
		body.PaymentMethod,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"is_success": false,
			"message":    err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"is_success": true,
		"message":    "Lacag bixinta waa la diwaan-geliyay, risidhkiina waa loo diray waalidka!",
		"receipt_no": receiptNo,
	})
}

func (h *PaymentHandler) GetStudentHistory(c *gin.Context) {
	idStr := c.Param("student_id")
	studentID, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"is_success": false, "message": "Invalid student_id parameter"})
		return
	}

	payments, status, err := h.svc.GetStudentPayments(uint(studentID))
	if err != nil {
		c.JSON(status, gin.H{"is_success": false, "message": err.Error()})
		return
	}

	c.JSON(status, gin.H{
		"is_success": true,
		"data":       payments,
	})
}

func (h *PaymentHandler) SendReminders(c *gin.Context) {
	var body dto.UnpaidReminderDTO
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"is_success": false, "message": err.Error()})
		return
	}

	sentCount, err := h.svc.SendUnpaidReminders(body.Month)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"is_success": false, "message": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"is_success": true,
		"message":    fmt.Sprintf("Fariimaha xusuusinta waxaa loo diray %d waalid!", sentCount),
	})
}
