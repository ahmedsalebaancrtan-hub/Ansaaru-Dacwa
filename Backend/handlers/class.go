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

type ClassHandler struct {
	ClassService services.ClassService
}

func RegisterClassHandler() *ClassHandler {

	classrepo := repository.NewClassRegister(infra.DB)
	classsvc := services.RegisterClassRepo(&classrepo)

	return &ClassHandler{

		ClassService: *classsvc,
	}

}

func (h *ClassHandler) CreateClass(c *gin.Context) {
	var RequestBody dto.CreateClassdto
	err := c.ShouldBindBodyWithJSON(&RequestBody)

	if err != nil {

		c.JSON(http.StatusBadRequest, gin.H{
			"messege":    "failed to Bind  body request",
			"is_success": false,
			"error":      err.Error(),
		})
		return
	}

	StatusCode, NewClass, err := h.ClassService.CreateClass(&RequestBody)

	if err != nil {
		c.JSON(StatusCode, gin.H{
			"is_success": false,
			"messege":    err.Error(),
		})
		return
	}

	c.JSON(StatusCode, gin.H{
		"is_sucess": true,
		"messege":   "Class Created sucessfully!",
		"data":      NewClass,
	})
}

func (h *ClassHandler) FindAll(c *gin.Context) {
	status, data, err := h.ClassService.FindAll()

	if err != nil {
		c.JSON(status, gin.H{
			"is_success": false,
			"messege":    err.Error(),
		})
		return
	}

	c.JSON(status, gin.H{
		"is_sucess": true,
		"messege":   "Classes fecthed sucessfully!",
		"data":      data,
	})

}

func (h *ClassHandler) FindByid(c *gin.Context) {
	IdStr := c.Param("classid")

	id, err := strconv.Atoi(IdStr)

	if err != nil {

		c.JSON(http.StatusBadRequest, gin.H{
			"messege":    "failed to get  Classid param",
			"is_success": false,
			"error":      err.Error(),
		})
		return
	}

	status, class, err := h.ClassService.FindById(uint(id))

	if err != nil {
		c.JSON(status, gin.H{
			"is_success": false,
			"messege":    err.Error(),
		})
		return
	}

	c.JSON(status, gin.H{
		"is_sucess": true,
		"messege":   "Class fecthed sucessfully!",
		"data":      class,
	})

}
func (h *ClassHandler) UpdateClass(c *gin.Context) {
	IdStr := c.Param("classid")

	id, err := strconv.Atoi(IdStr)

	if err != nil {

		c.JSON(http.StatusBadRequest, gin.H{
			"messege":    "failed to get  Classid param",
			"is_success": false,
			"error":      err.Error(),
		})
		return
	}

	var RequestBody dto.UpdateClassdto
	if err := c.ShouldBindBodyWithJSON(&RequestBody); err != nil {

		c.JSON(http.StatusBadRequest, gin.H{
			"messege":    "failed to Bind  body request",
			"is_success": false,
			"error":      err.Error(),
		})
		return
	}

	status, err := h.ClassService.UpdateClass(uint(id), RequestBody)

	if err != nil {
		c.JSON(status, gin.H{
			"is_success": false,
			"messege":    err.Error(),
		})
		return
	}

	c.JSON(status, gin.H{
		"is_sucess": true,
		"messege":   "Class Updated sucessfully!",
	})

}
