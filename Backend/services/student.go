package services

import (
	"errors"
	"log/slog"
	"net/http"
	"time"

	"github.com/ahmedsaleban/ansaru_dacwa/constants"
	"github.com/ahmedsaleban/ansaru_dacwa/dto"
	"github.com/ahmedsaleban/ansaru_dacwa/models"
	"github.com/ahmedsaleban/ansaru_dacwa/repository"
)

type StudentService struct {
	StudentRepo *repository.StudentRepo
	familyRepo  *repository.FamilyRepo
	classRepo   *repository.ClassRepo
}

func NewStudentService(studentRepo *repository.StudentRepo, familyRepo *repository.FamilyRepo, classRepo *repository.ClassRepo) *StudentService {
	return &StudentService{
		StudentRepo: studentRepo,
		familyRepo:  familyRepo,
		classRepo:   classRepo,
	}
}

func (svc *StudentService) CreateStudent(data dto.CreateStudentDto, imagePath string) (int, error) {
	// 1. Hubi in Family-gu jiro
	_, err := svc.familyRepo.GetfamilyByID(data.FamilyID)
	if err != nil {
		return http.StatusBadRequest, errors.New("selected family not found")
	}

	// 2. Hubi in Class-ku jiro
	_, err = svc.classRepo.FindById(data.ClassID)
	if err != nil {
		return http.StatusBadRequest, errors.New("selected class not found")
	}

	// 3. Date parsing
	admissionDate, err := time.Parse("2006-01-02", data.DateOfAdmission)
	if err != nil {
		admissionDate, err = time.Parse("02/01/2006", data.DateOfAdmission)
		if err != nil {
			return http.StatusBadRequest, errors.New("invalid date format for admission date, use YYYY-MM-DD or DD/MM/YYYY")
		}
	}

	var newStudent = models.Student{
		FullName:        data.FullName,
		StudentCode:     data.StudentCode,
		Picture:         imagePath, // Waxay noqon kartaa "" (empty string) haddii aan la soo gelin
		ClassID:         data.ClassID,
		DateOfAdmission: admissionDate,
		DiscountFee:     data.DiscountFee,  // Waxay noqon kartaa nil haddii aan la soo gelin
		MobileNumber:    data.MobileNumber, // Waxay noqon kartaa "" (empty string)
		FamilyID:        data.FamilyID,
	}

	err = svc.StudentRepo.CreateStudent(&newStudent)
	if err != nil {
		slog.Error("failed to create student", "error", err)
		return http.StatusInternalServerError, errors.New(constants.DefaultErrorMsg)
	}

	return http.StatusCreated, nil
}

func (svc *StudentService) ListStudent() (int, []models.Student, error) {
	data, err := svc.StudentRepo.ListStudent()
	if err != nil {
		slog.Error("Failed to list students", "error", err)
		return http.StatusInternalServerError, nil, errors.New(constants.DefaultErrorMsg)
	}
	return http.StatusOK, data, nil
}

func (svc *StudentService) GetStudentByID(id uint) (int, models.Student, error) {
	student, err := svc.StudentRepo.GetStudentByID(id)
	if err != nil {
		return http.StatusNotFound, models.Student{}, errors.New("student not found")
	}
	return http.StatusOK, student, nil
}
func (svc *StudentService) PromoteStudents(data dto.PromoteStudentsDTO) (int, error) {
	// 1. Hubi in fasalka cusub (ToClassID) uu dhab ahaan DB-ga ku jiro
	var classCount int64
	svc.classRepo.DB.Model(&models.Class{}).Where("id = ?", data.ToClassID).Count(&classCount)
	if classCount == 0 {
		return http.StatusNotFound, errors.New("fasalka loo guurinayo (target class) ma jiro")
	}

	// 2. Guuri ardayda
	err := svc.StudentRepo.PromoteStudents(data.StudentIDs, data.ToClassID)
	if err != nil {
		slog.Error("❌ Failed to promote students", "error", err)
		return http.StatusInternalServerError, errors.New("guurinta ardayda waa lagu dhibtooday")
	}

	return http.StatusOK, nil
}
