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

type TeacherHandler struct {
	TeacherService *services.TeacherService
}

func RegisterTeacherHandler() *TeacherHandler {
	teacherRepo := repository.NewTeacherRepo(infra.DB)
	teacherService := services.NewTeacherService(*teacherRepo)

	return &TeacherHandler{
		TeacherService: teacherService,
	}
}

func (h *TeacherHandler) CreateTeacher(c *gin.Context) {
	var body dto.CreateTeacherDto

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"is_success": false,
			"message":    "Failed to bind body request payload",
			"error":      err.Error(),
		})
		return
	}

	statusCode, err := h.TeacherService.CreateTeacher(body)
	if err != nil {
		c.JSON(statusCode, gin.H{
			"is_success": false,
			"message":    err.Error(),
		})
		return
	}

	c.JSON(statusCode, gin.H{
		"is_success": true,
		"message":    "Teacher profile added successfully",
	})
}
func (h *TeacherHandler) GetAllTeachers(c *gin.Context) {
	teachers, statusCode, err := h.TeacherService.GetAllTeachers()
	if err != nil {
		c.JSON(statusCode, gin.H{"is_success": false, "message": err.Error()})
		return
	}

	c.JSON(statusCode, gin.H{
		"is_success": true,
		"data":       teachers,
	})
}

func (h *TeacherHandler) GetTeacherByPhone(c *gin.Context) {
	phone := c.Param("phone")
	if phone == "" {
		c.JSON(http.StatusBadRequest, gin.H{"is_success": false, "message": "Phone number route parameter is required"})
		return
	}

	teacher, statusCode, err := h.TeacherService.GetTeacherByPhone(phone)
	if err != nil {
		c.JSON(statusCode, gin.H{"is_success": false, "message": err.Error()})
		return
	}

	c.JSON(statusCode, gin.H{
		"is_success": true,
		"data":       teacher,
	})
}

func (h *TeacherHandler) UpdateTeacher(c *gin.Context) {
	idParam := c.Param("id")
	teacherID, err := strconv.ParseUint(idParam, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"is_success": false, "message": "Invalid teacher ID parameter format"})
		return
	}

	var body dto.UpdateTeacherDto
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"is_success": false, "message": "Failed to parse body payload", "error": err.Error()})
		return
	}

	statusCode, err := h.TeacherService.UpdateTeacher(uint(teacherID), body)
	if err != nil {
		c.JSON(statusCode, gin.H{"is_success": false, "message": err.Error()})
		return
	}

	c.JSON(statusCode, gin.H{"is_success": true, "message": "Teacher records successfully adjusted"})
}
