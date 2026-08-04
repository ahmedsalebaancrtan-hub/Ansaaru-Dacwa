package handlers

import (
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
