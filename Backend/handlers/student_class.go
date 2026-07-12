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
	STudentClassService *services.StudentClassService
}

func RegisterStudentClass() *StudentClassHandler {
	StudentRepo := repository.NewSTudentRepo(infra.DB)
	StudentClassRepo := repository.NewStudentClassRepo(infra.DB)
	StudentClassService := services.NewSTudentClassServ(StudentClassRepo, StudentRepo)

	return &StudentClassHandler{
		STudentClassService: StudentClassService,
	}

}

func (h *StudentClassHandler) AddSTudentClass(c *gin.Context) {

	var body dto.AddStudentClassDto

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"messege":    "failed to Bind  body request",
			"is_success": false,
			"error":      err.Error(),
		})
		return

	}

	StatusCode, err := h.STudentClassService.AddStudentToClass(&body)

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

func (h *StudentClassHandler) FindClassStudentByClassID(c *gin.Context) {
	IdStr := c.Param("class_id")
	id, err := strconv.Atoi(IdStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"messege":    "failed to get classId param",
			"is_success": false,
			"error":      err.Error(),
		})
		return
	}
	status, classStudent, err := h.STudentClassService.ListSTudentClass(uint(id))

	if err != nil {
		c.JSON(status, gin.H{
			"is_success": false,
			"messege":    err.Error(),
		})
		return
	}

	c.JSON(status, gin.H{
		"messege":    "class fetched successfully",
		"is_success": true,
		"data":       classStudent,
	})
}
func (h *StudentClassHandler) DeactivateStudentclass(c *gin.Context) {
	IdStr := c.Param("student_id")
	id, err := strconv.Atoi(IdStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"messege":    "failed to get student_id param",
			"is_success": false,
			"error":      err.Error(),
		})
		return
	}
	status, err := h.STudentClassService.DeactiveStudentClass(uint(id))

	if err != nil {
		c.JSON(status, gin.H{
			"is_success": false,
			"messege":    err.Error(),
		})
		return
	}

	c.JSON(status, gin.H{
		"messege":    "Deactived student class successfully",
		"is_success": true,
	})
}
