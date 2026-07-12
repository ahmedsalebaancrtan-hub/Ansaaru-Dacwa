package handlers

import (
	"net/http"

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

	Familyrepo := repository.NewFamilyRepo(infra.DB)
	StudentRepo := repository.NewSTudentRepo(infra.DB)
	StudentService := services.NewStudenService(StudentRepo, Familyrepo)

	return &StudentHandler{
		StudentService: StudentService,
	}

}

func (h *StudentHandler) CreateStudent(c *gin.Context) {

	var body dto.CreateStudentDto

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"messege":    "failed to Bind  body request",
			"is_success": false,
			"error":      err.Error(),
		})
		return

	}

	StatusCode, err := h.StudentService.CreateStudent(body)

	if err != nil {
		c.JSON(StatusCode, gin.H{
			"is_success": false,
			"messege":    err.Error(),
		})
		return
	}

	c.JSON(StatusCode, gin.H{
		"is_success": true,
		"messege":    "Student Created successfully",
	})
}

func (h *StudentHandler) ListStudent(c *gin.Context) {
	status, data, err := h.StudentService.ListStudent()
	if err != nil {
		c.JSON(status, gin.H{
			"is_success": false,
			"messege":    err.Error(),
		})
		return
	}
	c.JSON(status, gin.H{
		"is_success": true,
		"messege":    "Students Listed successfully",
		"data":       data,
	})

}
