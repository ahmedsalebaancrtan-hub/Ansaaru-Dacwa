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

type SubjectHandler struct {
	SubjectService services.SubjectService
}

func RegisterSubjectHandler() *SubjectHandler {
	subjectRepo := repository.NewSubjectRepo(infra.DB)
	classRepo := repository.NewClassRegister(infra.DB)
	subjectSvc := services.RegisterSubjectService(&subjectRepo, &classRepo)

	return &SubjectHandler{
		SubjectService: *subjectSvc,
	}
}

func (h *SubjectHandler) AssignSubjects(c *gin.Context) {
	var requestBody dto.AssignSubjectsDTO
	if err := c.ShouldBindJSON(&requestBody); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"is_success": false,
			"message":    "invalid payload",
			"error":      err.Error(),
		})
		return
	}

	status, subjects, err := h.SubjectService.AssignSubjects(&requestBody)
	if err != nil {
		c.JSON(status, gin.H{
			"is_success": false,
			"message":    err.Error(),
		})
		return
	}

	c.JSON(status, gin.H{
		"is_success": true,
		"message":    "Subjects assigned successfully!",
		"data":       subjects,
	})
}

func (h *SubjectHandler) FindAll(c *gin.Context) {
	status, data, err := h.SubjectService.FindAll()
	if err != nil {
		c.JSON(status, gin.H{
			"is_success": false,
			"message":    err.Error(),
		})
		return
	}

	c.JSON(status, gin.H{
		"is_success": true,
		"message":    "Subjects fetched successfully!",
		"data":       data,
	})
}

func (h *SubjectHandler) FindByClassID(c *gin.Context) {
	classIDStr := c.Param("classid")
	classID, err := strconv.Atoi(classIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"is_success": false,
			"message":    "invalid classid parameter",
		})
		return
	}

	status, data, err := h.SubjectService.FindByClassID(uint(classID))
	if err != nil {
		c.JSON(status, gin.H{
			"is_success": false,
			"message":    err.Error(),
		})
		return
	}

	c.JSON(status, gin.H{
		"is_success": true,
		"message":    "Class subjects fetched successfully!",
		"data":       data,
	})
}

func (h *SubjectHandler) UpdateSubject(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"is_success": false,
			"message":    "invalid subject id parameter",
		})
		return
	}

	var requestBody dto.UpdateSubjectDTO
	if err := c.ShouldBindJSON(&requestBody); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"is_success": false,
			"message":    "invalid request body",
			"error":      err.Error(),
		})
		return
	}

	status, err := h.SubjectService.UpdateSubject(uint(id), requestBody)
	if err != nil {
		c.JSON(status, gin.H{
			"is_success": false,
			"message":    err.Error(),
		})
		return
	}

	c.JSON(status, gin.H{
		"is_success": true,
		"message":    "Subject updated successfully!",
	})
}

func (h *SubjectHandler) DeleteSubject(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"is_success": false,
			"message":    "invalid subject id parameter",
		})
		return
	}

	status, err := h.SubjectService.DeleteSubject(uint(id))
	if err != nil {
		c.JSON(status, gin.H{
			"is_success": false,
			"message":    err.Error(),
		})
		return
	}

	c.JSON(status, gin.H{
		"is_success": true,
		"message":    "Subject deleted successfully!",
	})
}
