package routes

import (
	"github.com/ahmedsaleban/ansaru_dacwa/handlers"
	"github.com/gin-gonic/gin"
)

func RegIsterRouter(r *gin.Engine) {
	ApiGroup := r.Group("/api")

	UserHandler := handlers.RegisterUserHandler()
	UserGroup := ApiGroup.Group("/users")
	{
		UserGroup.POST("/register", UserHandler.CreateUser)
	}
}
