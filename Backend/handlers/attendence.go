package handlers

import (
	"net/http"
	"strconv"
	"time"

	"github.com/ahmedsaleban/ansaru_dacwa/dto"
	"github.com/ahmedsaleban/ansaru_dacwa/infra"
	"github.com/ahmedsaleban/ansaru_dacwa/repository"
	"github.com/ahmedsaleban/ansaru_dacwa/services"
	"github.com/gin-gonic/gin"
)

type AttendanceHandler struct {
	svc *services.AttendanceService
}

func RegisterAttendanceHandler() *AttendanceHandler {
	repo := repository.NewAttendanceRepo(infra.DB)
	classRepo := repository.NewClassRegister(infra.DB)
	svc := services.NewAttendanceService(repo, &classRepo)

	return &AttendanceHandler{svc: svc}
}

func (h *AttendanceHandler) MarkAttendance(c *gin.Context) {
	var body dto.MarkBulkAttendanceDTO
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"is_success": false,
			"message":    "Invalid request body",
			"error":      err.Error(),
		})
		return
	}

	status, err := h.svc.MarkAttendance(&body)
	if err != nil {
		c.JSON(status, gin.H{"is_success": false, "message": err.Error()})
		return
	}

	c.JSON(status, gin.H{
		"is_success": true,
		"message":    "Attendance recorded successfully!",
	})
}

func (h *AttendanceHandler) GetClassAttendance(c *gin.Context) {
	classIDStr := c.Query("class_id")
	dateStr := c.Query("date")

	classID, err := strconv.Atoi(classIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"is_success": false, "message": "valid class_id is required"})
		return
	}

	parsedDate, err := time.Parse("2006-01-02", dateStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"is_success": false, "message": "date must be in YYYY-MM-DD format"})
		return
	}

	records, status, err := h.svc.GetClassAttendance(uint(classID), parsedDate)
	if err != nil {
		c.JSON(status, gin.H{"is_success": false, "message": err.Error()})
		return
	}

	c.JSON(status, gin.H{
		"is_success": true,
		"data":       records,
	})
}
