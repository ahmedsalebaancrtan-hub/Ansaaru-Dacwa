package routes

import (
	"github.com/ahmedsaleban/ansaru_dacwa/handlers"
	"github.com/ahmedsaleban/ansaru_dacwa/middleware"
	"github.com/gin-gonic/gin"
)

func RegIsterRouter(r *gin.Engine) {
	ApiGroup := r.Group("/api")

	UserHandler := handlers.RegisterUserHandler()
	ClassHandler := handlers.RegisterClassHandler()
	FamilyHandler := handlers.RegisterFamilyHandler()
	StudentHandler := handlers.RegisterStudentHandler()
	StudentClassHandler := handlers.RegisterStudentClass()

	UserGroup := ApiGroup.Group("/users")
	{
		UserGroup.POST("/register", UserHandler.CreateUser)
		UserGroup.POST("/Login", UserHandler.LoginUser)
		UserGroup.POST("/forget-password", UserHandler.ForgotPassword)
		UserGroup.POST("/reset", UserHandler.ResetPassword)
		UserGroup.GET("/whoami", middleware.Authenticated(), middleware.RequiredRole("ADMIN", "STUDENT_AFFAIRS", "CASHIER"), UserHandler.WhoAmI)
		UserGroup.POST("/Refresh_token", middleware.RefreshAuthenticated(), UserHandler.RefreshToken)
	}

	ClassGroup := ApiGroup.Group("/class")
	{
		ClassGroup.POST("/create", ClassHandler.CreateClass)
		ClassGroup.PUT("/update/:classid", middleware.Authenticated(), middleware.RequiredRole("ADMIN", "STUDENT_AFFAIRS"), ClassHandler.UpdateClass)
		ClassGroup.GET("/list", middleware.Authenticated(), middleware.RequiredRole("ADMIN", "STUDENT_AFFAIRS", "CASHIER"), ClassHandler.FindAll)
		ClassGroup.GET("/details/:classid", middleware.Authenticated(), middleware.RequiredRole("ADMIN", "STUDENT_AFFAIRS", "CASHIER"), ClassHandler.FindByid)
	}

	FamilyGroup := ApiGroup.Group("/family")
	{
		FamilyGroup.POST("/create", middleware.Authenticated(), middleware.RequiredRole("ADMIN", "CASHIER"), FamilyHandler.CreateFamily)
	}

	StudentGroup := ApiGroup.Group("/student")
	{
		StudentGroup.POST("/create", middleware.Authenticated(), middleware.RequiredRole("ADMIN", "STUDENT_AFFAIRS"), StudentHandler.CreateStudent)
		StudentGroup.GET("/list", middleware.Authenticated(), middleware.RequiredRole("ADMIN", "STUDENT_AFFAIRS", "CASHIER"), StudentHandler.ListStudent)
	}

	StudenClassGroup := ApiGroup.Group("/student_class")
	{
		StudenClassGroup.POST("/Add", middleware.Authenticated(), middleware.RequiredRole("ADMIN", "STUDENT_AFFAIRS"), StudentClassHandler.AddSTudentClass)
		StudenClassGroup.GET("/list/:class_id", middleware.Authenticated(), middleware.RequiredRole("ADMIN", "STUDENT_AFFAIRS", "CASHIER"), StudentClassHandler.FindClassStudentByClassID)
		StudenClassGroup.PUT("/Deactivate/:student_id", middleware.Authenticated(), middleware.RequiredRole("ADMIN", "STUDENT_AFFAIRS"), StudentClassHandler.DeactivateStudentclass)
	}
}
