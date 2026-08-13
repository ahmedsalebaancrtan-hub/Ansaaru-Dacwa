package handlers

import (
	"fmt"
	"net/http"
	"path/filepath"
	"strconv"

	"github.com/ahmedsaleban/ansaru_dacwa/dto"
	"github.com/ahmedsaleban/ansaru_dacwa/infra"
	"github.com/ahmedsaleban/ansaru_dacwa/repository"
	"github.com/ahmedsaleban/ansaru_dacwa/services"
	"github.com/gin-gonic/gin"
)

type StudentHandler struct {
	StudentService *services.StudentService
}

func RegisterStudentHandler() *StudentHandler {
	familyRepo := repository.NewFamilyRepo(infra.DB)
	studentRepo := repository.NewStudentRepo(infra.DB)
	classRepo := repository.NewClassRegister(infra.DB)
	studentService := services.NewStudentService(studentRepo, familyRepo, &classRepo)

	return &StudentHandler{
		StudentService: studentService,
	}
}
func (h *StudentHandler) CreateStudent(c *gin.Context) {
	var body dto.CreateStudentDto

	// Gin Multipart Form binding
	if err := c.ShouldBind(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"is_success": false,
			"message":    "failed to bind body request",
			"error":      err.Error(),
		})
		return
	}

	// 1. Picture Upload Handling (OPTIONAL)
	var imagePath string
	file, err := c.FormFile("picture")
	if err == nil && file != nil { // Kaliya haddii uu sawir jiro ayaa la process gareynayaa
		// Max Size 100KB
		if file.Size > 100*1024 {
			c.JSON(http.StatusBadRequest, gin.H{
				"is_success": false,
				"message":    "Picture size must be less than 100KB",
			})
			return
		}

		filename := fmt.Sprintf("%s_%s", body.StudentCode, filepath.Base(file.Filename))
		imagePath = filepath.Join("uploads/students", filename)
		if err := c.SaveUploadedFile(file, imagePath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"is_success": false,
				"message":    "Failed to save image file",
			})
			return
		}
	}

	statusCode, err := h.StudentService.CreateStudent(body, imagePath)
	if err != nil {
		c.JSON(statusCode, gin.H{
			"is_success": false,
			"message":    err.Error(),
		})
		return
	}

	c.JSON(statusCode, gin.H{
		"is_success": true,
		"message":    "Student registered successfully!",
	})
}

func (h *StudentHandler) ListStudent(c *gin.Context) {
	status, data, err := h.StudentService.ListStudent()
	if err != nil {
		c.JSON(status, gin.H{
			"is_success": false,
			"message":    err.Error(),
		})
		return
	}
	c.JSON(status, gin.H{
		"is_success": true,
		"message":    "Students fetched successfully!",
		"data":       data,
	})
}

func (h *StudentHandler) GetStudentByID(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"is_success": false,
			"message":    "Invalid student id parameter",
		})
		return
	}

	status, student, err := h.StudentService.GetStudentByID(uint(id))
	if err != nil {
		c.JSON(status, gin.H{
			"is_success": false,
			"message":    err.Error(),
		})
		return
	}

	c.JSON(status, gin.H{
		"is_success": true,
		"message":    "Student details fetched successfully!",
		"data":       student,
	})
}
