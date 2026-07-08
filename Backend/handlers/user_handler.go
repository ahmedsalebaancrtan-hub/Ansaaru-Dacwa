package handlers

import (
	"net/http"

	"github.com/ahmedsaleban/ansaru_dacwa/dto"
	"github.com/ahmedsaleban/ansaru_dacwa/infra"
	"github.com/ahmedsaleban/ansaru_dacwa/repository"
	"github.com/ahmedsaleban/ansaru_dacwa/services"
	"github.com/gin-gonic/gin"
)

type UserHandler struct {
	Userservice services.Userservice
}

func RegisterUserHandler() *UserHandler {
	UserRepo := repository.RegisterRepo(infra.DB)
	usersvc := services.RegisterService(UserRepo)

	return &UserHandler{
		Userservice: *usersvc,
	}
}

func (h *UserHandler) CreateUser(c *gin.Context) {
	var RequestBody dto.CreateUserDto
	err := c.ShouldBindBodyWithJSON(&RequestBody)

	if err != nil {

		c.JSON(http.StatusBadRequest, gin.H{
			"messege":    "failed to Bind  body request",
			"is_success": false,
			"error":      err.Error(),
		})
		return
	}

	StatusCode, err := h.Userservice.CreateUser(&RequestBody)

	if err != nil {
		c.JSON(StatusCode, gin.H{
			"is_success": false,
			"messege":    err.Error(),
		})
		return
	}

	c.JSON(StatusCode, gin.H{
		"is_sucess": true,
		"messege":   "User Created sucessfully!",
	})
}
