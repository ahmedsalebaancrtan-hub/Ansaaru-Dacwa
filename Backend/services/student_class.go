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

type StudentClassService struct {
	StudentClassRepo *repository.StudentClassRepo
	StudentRepo      *repository.StudentRepo
}

func NewSTudentClassServ(StudentClassRepo *repository.StudentClassRepo, StudentRepo *repository.StudentRepo) *StudentClassService {
	return &StudentClassService{
		StudentClassRepo: StudentClassRepo,
		StudentRepo:      StudentRepo,
	}
}

func (svc *StudentClassService) AddStudentToClass(data *dto.AddStudentClassDto) (int, error) {

	//check student has an active class

	student, _ := svc.StudentClassRepo.GetActiveClass(data.StudentID)

	if student.ID != 0 {
		return http.StatusBadRequest, errors.New("this student already another class. Please deactivate that class first")

	}

	err := svc.StudentClassRepo.AddStudentClass(data.ClassID, data.StudentID)

	if err != nil {
		slog.Info("failed to add student to a class", "error", err)
		return http.StatusInternalServerError, errors.New(constants.DefaultErrorMsg)
	}

	return http.StatusOK, nil

}

func (svc *StudentClassService) ListSTudentClass(ClassID uint) (int, []models.StudentClass, error) {
	ClassStudent, err := svc.StudentClassRepo.GetClassStudent(ClassID)

	if err != nil {
		slog.Info("failed to get class student", "error", err)

		return http.StatusInternalServerError, nil, errors.New(constants.DefaultErrorMsg)

	}

	return http.StatusOK, ClassStudent, nil
}

func (svc *StudentClassService) DeactiveStudentClass(StudentID uint) (int, error) {
	slog.Info("Check if student exist inthe class")

	_, err := svc.StudentRepo.GetStudentByID(StudentID)

	if err != nil {
		slog.Error("failed to deactivate student", "error", err.Error())
		return http.StatusNotFound, errors.New(constants.NotFound)
	}
	slog.Info("Deactivate classes")

	err = svc.StudentClassRepo.DeactiveStudentClass(StudentID)
	if err != nil {
		return http.StatusInternalServerError, errors.New(constants.DefaultErrorMsg)
	}
	return http.StatusOK, nil
}
