package handlers

import (
	"net/http"

	"github.com/ahmedsaleban/ansaru_dacwa/dto"
	"github.com/ahmedsaleban/ansaru_dacwa/infra"
	"github.com/ahmedsaleban/ansaru_dacwa/repository"
	"github.com/ahmedsaleban/ansaru_dacwa/services"
	"github.com/gin-gonic/gin"
)

type FamilyHandler struct {
	FamilyService *services.FamilyService
}

func RegisterFamilyHandler() *FamilyHandler {

	Familyrepo := repository.NewFamilyRepo(infra.DB)
	Familyservice := services.NewFamilyService(*Familyrepo)

	return &FamilyHandler{
		FamilyService: Familyservice,
	}

}

func (h *FamilyHandler) CreateFamily(c *gin.Context) {

	var body dto.CreateFamilydto

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"messege":    "failed to Bind  body request",
			"is_success": false,
			"error":      err.Error(),
		})
		return

	}

	StatusCode, err := h.FamilyService.CreateFamily(body)

	if err != nil {
		c.JSON(StatusCode, gin.H{
			"is_success": false,
			"messege":    err.Error(),
		})
		return
	}

	c.JSON(StatusCode, gin.H{
		"is_success": true,
		"messege":    "family Created successfully",
	})
}

func (h *FamilyHandler) FindAll(c *gin.Context) {
	StatusCode, data, err := h.FamilyService.ListFamily()

	if err != nil {
		c.JSON(StatusCode, gin.H{
			"is_success": false,
			"messege":    err.Error(),
		})
		return
	}
	c.JSON(StatusCode, gin.H{
		"is_success": true,
		"messege":    "family lists Fetched successfully",
		"data":       data,
	})
}
