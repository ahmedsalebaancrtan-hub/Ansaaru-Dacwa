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

type EmployeeHandler struct {
	EmployeeService *services.EmployeeService
}

func RegisterEmployeeHandler() *EmployeeHandler {
	repo := repository.NewEmployeeRepo(infra.DB)
	service := services.NewEmployeeService(repo)

	return &EmployeeHandler{
		EmployeeService: service,
	}
}

func (h *EmployeeHandler) CreateEmployee(c *gin.Context) {
	var body dto.CreateEmployeeDto
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"is_success": false,
			"message":    "Invalid request payload",
			"error":      err.Error(),
		})
		return
	}

	statusCode, err := h.EmployeeService.CreateEmployee(body)
	if err != nil {
		c.JSON(statusCode, gin.H{
			"is_success": false,
			"message":    err.Error(),
		})
		return
	}

	c.JSON(statusCode, gin.H{
		"is_success": true,
		"message":    "Employee added successfully",
	})
}

func (h *EmployeeHandler) GetAllEmployees(c *gin.Context) {
	employees, statusCode, err := h.EmployeeService.GetAllEmployees()
	if err != nil {
		c.JSON(statusCode, gin.H{"is_success": false, "message": err.Error()})
		return
	}

	c.JSON(statusCode, gin.H{
		"is_success": true,
		"data":       employees,
	})
}

func (h *EmployeeHandler) UpdateEmployee(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"is_success": false, "message": "Invalid employee ID"})
		return
	}

	var body dto.UpdateEmployeeDto
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"is_success": false, "message": "Failed to parse payload", "error": err.Error()})
		return
	}

	statusCode, err := h.EmployeeService.UpdateEmployee(uint(id), body)
	if err != nil {
		c.JSON(statusCode, gin.H{"is_success": false, "message": err.Error()})
		return
	}

	c.JSON(statusCode, gin.H{"is_success": true, "message": "Employee updated successfully"})
}
