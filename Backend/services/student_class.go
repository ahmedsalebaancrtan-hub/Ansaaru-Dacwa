package services

import (
	"errors"
	"log/slog"
	"net/http"

	"github.com/ahmedsaleban/ansaru_dacwa/constants"
	"github.com/ahmedsaleban/ansaru_dacwa/dto"
	"github.com/ahmedsaleban/ansaru_dacwa/models"
	"github.com/ahmedsaleban/ansaru_dacwa/repository"
	"gorm.io/gorm"
)

type StudentClassService struct {
	StudentClassRepo *repository.StudentClassRepo
	StudentRepo      *repository.StudentRepo
}

func NewStudentClassService(studentClassRepo *repository.StudentClassRepo, studentRepo *repository.StudentRepo) *StudentClassService {
	return &StudentClassService{
		StudentClassRepo: studentClassRepo,
		StudentRepo:      studentRepo,
	}
}

func (svc *StudentClassService) AddStudentToClass(data *dto.AddStudentClassDto) (int, error) {
	// 1. Hubi in ardaygu jiro DB-ga
	_, err := svc.StudentRepo.GetStudentByID(data.StudentID)
	if err != nil {
		return http.StatusNotFound, errors.New("student not found")
	}

	// 2. Hubi in ardaygu horey ugu jiro fasal Active ah
	activeClass, err := svc.StudentClassRepo.GetActiveClass(data.StudentID)
	if err == nil && activeClass.ID != 0 {
		return http.StatusBadRequest, errors.New("this student already belongs to an active class. Please deactivate that class first")
	}

	// 3. Ku dar fasalka cusub
	err = svc.StudentClassRepo.AddStudentClass(data.StudentID, data.ClassID)
	if err != nil {
		slog.Error("failed to add student to a class", "error", err)
		return http.StatusInternalServerError, errors.New(constants.DefaultErrorMsg)
	}

	return http.StatusOK, nil
}

func (svc *StudentClassService) ListStudentClass(classID uint) (int, []models.StudentClass, error) {
	classStudents, err := svc.StudentClassRepo.GetClassStudents(classID)
	if err != nil {
		slog.Error("failed to get class students", "error", err)
		return http.StatusInternalServerError, nil, errors.New(constants.DefaultErrorMsg)
	}

	return http.StatusOK, classStudents, nil
}

func (svc *StudentClassService) DeactivateStudentClass(studentID uint) (int, error) {
	// 1. Hubi in ardaygu jiro
	_, err := svc.StudentRepo.GetStudentByID(studentID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return http.StatusNotFound, errors.New("student not found")
		}
		return http.StatusInternalServerError, errors.New(constants.DefaultErrorMsg)
	}

	// 2. Deactivate-gareey fasaladiisa active-ka ah
	err = svc.StudentClassRepo.DeactivateStudentClass(studentID)
	if err != nil {
		slog.Error("failed to deactivate student class", "error", err)
		return http.StatusInternalServerError, errors.New(constants.DefaultErrorMsg)
	}

	return http.StatusOK, nil
}
