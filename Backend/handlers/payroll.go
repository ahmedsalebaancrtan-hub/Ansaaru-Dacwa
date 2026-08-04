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

type PayrollHandler struct {
	svc *services.PayrollService
}

func RegisterPayrollHandler() *PayrollHandler {
	repo := repository.NewPayrollRepo(infra.DB)
	svc := services.NewPayrollService(repo)
	return &PayrollHandler{svc: svc}
}

func (h *PayrollHandler) PaySalary(c *gin.Context) {
	var body dto.PaySalaryDTO
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"is_success": false, "message": err.Error()})
		return
	}

	payment, status, err := h.svc.PaySalary(body)
	if err != nil {
		c.JSON(status, gin.H{"is_success": false, "message": err.Error()})
		return
	}

	c.JSON(status, gin.H{"is_success": true, "message": "Mushaharka si guul leh ayaa loo bixiyay", "data": payment})
}

func (h *PayrollHandler) GetHistory(c *gin.Context) {
	employeeID, _ := strconv.Atoi(c.Query("employee_id"))

	payments, status, err := h.svc.GetHistory(uint(employeeID))
	if err != nil {
		c.JSON(status, gin.H{"is_success": false, "message": err.Error()})
		return
	}

	c.JSON(status, gin.H{"is_success": true, "data": payments})
}
