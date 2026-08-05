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
	employeeHandler := handlers.RegisterEmployeeHandler()
	subjectHandler := handlers.RegisterSubjectHandler()
	attendanceHandler := handlers.RegisterAttendanceHandler()
	paymentHandler := handlers.RegisterPaymentHandler()
	examHandler := handlers.RegisterExamHandler()
	payrollHandler := handlers.RegisterPayrollHandler()
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
		StudentGroup.POST("/promote", middleware.Authenticated(), middleware.RequiredRole("ADMIN"), StudentHandler.PromoteStudents)
	}
	StudentClassGroup := ApiGroup.Group("/student_class")
	{
		StudentClassGroup.POST("/add", middleware.Authenticated(), middleware.RequiredRole("ADMIN", "STUDENT_AFFAIRS"), studentClassHandler.AddStudentClass)
		StudentClassGroup.GET("/list/:class_id", middleware.Authenticated(), middleware.RequiredRole("ADMIN", "STUDENT_AFFAIRS", "CASHIER"), studentClassHandler.FindClassStudentByClassID)
		StudentClassGroup.PUT("/deactivate/:student_id", middleware.Authenticated(), middleware.RequiredRole("ADMIN", "STUDENT_AFFAIRS"), studentClassHandler.DeactivateStudentClass)
	}

	EmployeeGroup := ApiGroup.Group("/employee")
	{
		EmployeeGroup.POST("/create", middleware.Authenticated(), middleware.RequiredRole("ADMIN", "HUMAN_RESOURCES"), employeeHandler.CreateEmployee)
		EmployeeGroup.GET("/list", middleware.Authenticated(), middleware.RequiredRole("ADMIN", "HUMAN_RESOURCES", "ACCOUNTANT"), employeeHandler.GetAllEmployees)
		EmployeeGroup.PUT("/update/:id", middleware.Authenticated(), middleware.RequiredRole("ADMIN", "HUMAN_RESOURCES"), employeeHandler.UpdateEmployee)
	}
	SubjectGroup := ApiGroup.Group("/subject")
	{
		SubjectGroup.POST("/assign", middleware.Authenticated(), middleware.RequiredRole("ADMIN", "STUDENT_AFFAIRS"), subjectHandler.AssignSubjects)
		SubjectGroup.GET("/list", middleware.Authenticated(), middleware.RequiredRole("ADMIN", "STUDENT_AFFAIRS", "CASHIER"), subjectHandler.FindAll)
		SubjectGroup.GET("/class/:class_id", middleware.Authenticated(), middleware.RequiredRole("ADMIN", "STUDENT_AFFAIRS", "CASHIER"), subjectHandler.FindByClassID)
		SubjectGroup.PUT("/update/:id", middleware.Authenticated(), middleware.RequiredRole("ADMIN", "STUDENT_AFFAIRS"), subjectHandler.UpdateSubject)
		SubjectGroup.DELETE("/delete/:id", middleware.Authenticated(), middleware.RequiredRole("ADMIN", "STUDENT_AFFAIRS"), subjectHandler.DeleteSubject)
	}
	AttendanceGroup := ApiGroup.Group("/attendance")
	{
		AttendanceGroup.POST("/mark", middleware.Authenticated(), middleware.RequiredRole("ADMIN", "TEACHER", "STUDENT_AFFAIRS"), attendanceHandler.MarkAttendance)
		AttendanceGroup.GET("/class", middleware.Authenticated(), middleware.RequiredRole("ADMIN", "TEACHER", "STUDENT_AFFAIRS"), attendanceHandler.GetClassAttendance)
	}
	PaymentGroup := ApiGroup.Group("/payment")
	{
		PaymentGroup.POST("/pay", middleware.Authenticated(), middleware.RequiredRole("ADMIN", "CASHIER", "ACCOUNTANT"), paymentHandler.ProcessPayment)
		PaymentGroup.GET("/student/:student_id", middleware.Authenticated(), middleware.RequiredRole("ADMIN", "CASHIER", "ACCOUNTANT"), paymentHandler.GetStudentHistory)
		PaymentGroup.POST("/send-reminders", middleware.Authenticated(), middleware.RequiredRole("ADMIN", "ACCOUNTANT"), paymentHandler.SendReminders)
	}
	ExamGroup := ApiGroup.Group("/exams")
	{
		ExamGroup.POST("/create", middleware.Authenticated(), middleware.RequiredRole("ADMIN"), examHandler.CreateExam)
		ExamGroup.POST("/marks/submit", middleware.Authenticated(), middleware.RequiredRole("ADMIN", "TEACHER"), examHandler.SubmitMarks)
		ExamGroup.GET("/report-card/student/:student_id/exam/:exam_id", middleware.Authenticated(), examHandler.GetReportCard)
		ExamGroup.POST("/marks/upload-excel", middleware.Authenticated(), middleware.RequiredRole("ADMIN", "TEACHER"), examHandler.UploadMarksExcel)
	}
	PayrollGroup := ApiGroup.Group("/payroll")
	{
		PayrollGroup.POST("/pay", middleware.Authenticated(), middleware.RequiredRole("ADMIN", "ACCOUNTANT"), payrollHandler.PaySalary)
		PayrollGroup.GET("/history", middleware.Authenticated(), middleware.RequiredRole("ADMIN", "ACCOUNTANT"), payrollHandler.GetHistory)
	}
}
