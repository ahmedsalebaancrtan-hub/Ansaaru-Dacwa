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
	studentClassHandler := handlers.RegisterStudentClassHandler()
	teacherHandler := handlers.RegisterTeacherHandler()
	subjectHandler := handlers.RegisterSubjectHandler()
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
		FamilyGroup.GET("/list", middleware.Authenticated(), middleware.RequiredRole("ADMIN", "STUDENT_AFFAIRS", "CASHIER"), FamilyHandler.FindAll)
	}
	StudentGroup := ApiGroup.Group("/student")
	{
		StudentGroup.POST("/create", middleware.Authenticated(), middleware.RequiredRole("ADMIN", "STUDENT_AFFAIRS"), StudentHandler.CreateStudent)
		StudentGroup.GET("/list", middleware.Authenticated(), middleware.RequiredRole("ADMIN", "STUDENT_AFFAIRS", "CASHIER"), StudentHandler.ListStudent)
		StudentGroup.GET("/details/:id", middleware.Authenticated(), middleware.RequiredRole("ADMIN", "STUDENT_AFFAIRS", "CASHIER"), StudentHandler.GetStudentByID)
	}
	StudentClassGroup := ApiGroup.Group("/student_class")
	{
		StudentClassGroup.POST("/add", middleware.Authenticated(), middleware.RequiredRole("ADMIN", "STUDENT_AFFAIRS"), studentClassHandler.AddStudentClass)
		StudentClassGroup.GET("/list/:class_id", middleware.Authenticated(), middleware.RequiredRole("ADMIN", "STUDENT_AFFAIRS", "CASHIER"), studentClassHandler.FindClassStudentByClassID)
		StudentClassGroup.PUT("/deactivate/:student_id", middleware.Authenticated(), middleware.RequiredRole("ADMIN", "STUDENT_AFFAIRS"), studentClassHandler.DeactivateStudentClass)
	}

	TeacherGroup := ApiGroup.Group("/teacher")
	{
		TeacherGroup.POST("/create", middleware.Authenticated(), middleware.RequiredRole("ADMIN", "StudentAffairs"), teacherHandler.CreateTeacher)
		TeacherGroup.PUT("/update/:id", middleware.Authenticated(), middleware.RequiredRole("ADMIN", "StudentAffairs"), teacherHandler.UpdateTeacher)
		TeacherGroup.GET("/all", middleware.Authenticated(), middleware.RequiredRole("ADMIN", "StudentAffairs"), teacherHandler.GetAllTeachers)
		TeacherGroup.GET("/phone/:phone", middleware.Authenticated(), middleware.RequiredRole("ADMIN", "StudentAffairs"), teacherHandler.GetTeacherByPhone)
	}
	SubjectGroup := ApiGroup.Group("/subject")
	{
		SubjectGroup.POST("/assign", middleware.Authenticated(), middleware.RequiredRole("ADMIN", "STUDENT_AFFAIRS"), subjectHandler.AssignSubjects)
		SubjectGroup.GET("/list", middleware.Authenticated(), middleware.RequiredRole("ADMIN", "STUDENT_AFFAIRS", "CASHIER"), subjectHandler.FindAll)
		SubjectGroup.GET("/class/:classid", middleware.Authenticated(), middleware.RequiredRole("ADMIN", "STUDENT_AFFAIRS", "CASHIER"), subjectHandler.FindByClassID)
		SubjectGroup.PUT("/update/:id", middleware.Authenticated(), middleware.RequiredRole("ADMIN", "STUDENT_AFFAIRS"), subjectHandler.UpdateSubject)
		SubjectGroup.DELETE("/delete/:id", middleware.Authenticated(), middleware.RequiredRole("ADMIN", "STUDENT_AFFAIRS"), subjectHandler.DeleteSubject)
	}
}
