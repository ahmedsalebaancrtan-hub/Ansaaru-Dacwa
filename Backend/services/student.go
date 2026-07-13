package services

import (
	"errors"
	"log/slog"
	"net/http"

	"github.com/ahmedsaleban/ansaru_dacwa/constants"
	"github.com/ahmedsaleban/ansaru_dacwa/dto"
	"github.com/ahmedsaleban/ansaru_dacwa/models"
	"github.com/ahmedsaleban/ansaru_dacwa/repository"
)

type StudentService struct {
	StudentRepo *repository.StudentRepo
	familyRepo  *repository.FamilyRepo
}

func NewStudenService(StudentRepo *repository.StudentRepo, familyRepo *repository.FamilyRepo) *StudentService {

	return &StudentService{
		StudentRepo: StudentRepo,
		familyRepo:  familyRepo,
	}
}

func (svc *StudentService) CreateStudent(data dto.CreateStudentDto) (int, error) {
	var existingFamily models.Family
	err := svc.familyRepo.DB.First(&existingFamily, data.FamilyID).Error

	if err != nil {
		slog.Info("Family not found", "error", err)
		return http.StatusBadRequest, errors.New("selected family not found")
	}

	var NewStudent = models.Student{
		FirstName:   data.FirstName,
		MiddleName:  data.MiddleName,
		LastName:    data.LastName,
		StudentCode: data.StudentCode,
		Gender:      data.Gender,
		FamilyID:    existingFamily.ID,
	}
	err = svc.StudentRepo.CreateStudent(NewStudent)

	if err != nil {
		slog.Info("failed to create student", "error", err)
		return http.StatusInternalServerError, errors.New(constants.DefaultErrorMsg)
	}

	return http.StatusCreated, nil
}

func (svc *StudentService) ListStudent() (int, []models.Student, error) {
	data, err := svc.StudentRepo.ListStudent()
	if err != nil {
		slog.Info("Failed to list student", "error", err)
		return http.StatusInternalServerError, nil, errors.New(constants.DefaultErrorMsg)
	}

	return http.StatusOK, data, nil

}
