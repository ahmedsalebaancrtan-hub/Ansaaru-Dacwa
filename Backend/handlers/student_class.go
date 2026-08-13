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

type StudentClassHandler struct {
	StudentClassService *services.StudentClassService
}

func RegisterStudentClassHandler() *StudentClassHandler {
	studentRepo := repository.NewStudentRepo(infra.DB)
	studentClassRepo := repository.NewStudentClassRepo(infra.DB)
	studentClassService := services.NewStudentClassService(studentClassRepo, studentRepo)

	return &StudentClassHandler{
		StudentClassService: studentClassService,
	}
}

func (h *StudentClassHandler) AddStudentClass(c *gin.Context) {
	var body dto.AddStudentClassDto

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"is_success": false,
			"message":    "failed to bind request body",
			"error":      err.Error(),
		})
		return
	}

	statusCode, err := h.StudentClassService.AddStudentToClass(&body)
	if err != nil {
		c.JSON(statusCode, gin.H{
			"is_success": false,
			"message":    err.Error(),
		})
		return
	}

	c.JSON(statusCode, gin.H{
		"is_success": true,
		"message":    "Student assigned to class successfully!",
	})
}

func (h *StudentClassHandler) FindClassStudentByClassID(c *gin.Context) {
	idStr := c.Param("class_id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"is_success": false,
			"message":    "failed to parse class_id parameter",
			"error":      err.Error(),
		})
		return
	}

	status, classStudents, err := h.StudentClassService.ListStudentClass(uint(id))
	if err != nil {
		c.JSON(status, gin.H{
			"is_success": false,
			"message":    err.Error(),
		})
		return
	}

	c.JSON(status, gin.H{
		"is_success": true,
		"message":    "Class students fetched successfully!",
		"data":       classStudents,
	})
}

func (h *StudentClassHandler) DeactivateStudentClass(c *gin.Context) {
	idStr := c.Param("student_id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"is_success": false,
			"message":    "failed to parse student_id parameter",
			"error":      err.Error(),
		})
		return
	}

	status, err := h.StudentClassService.DeactivateStudentClass(uint(id))
	if err != nil {
		c.JSON(status, gin.H{
			"is_success": false,
			"message":    err.Error(),
		})
		return
	}

	c.JSON(status, gin.H{
		"is_success": true,
		"message":    "Student class deactivated successfully!",
	})
}
