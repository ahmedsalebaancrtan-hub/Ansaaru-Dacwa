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

type TeacherService struct {
	TeacherRepo repository.TeacherRepo
}

func NewTeacherService(teacherRepo repository.TeacherRepo) *TeacherService {
	return &TeacherService{
		TeacherRepo: teacherRepo,
	}
}

func (svc *TeacherService) CreateTeacher(data dto.CreateTeacherDto) (int, error) {
	newTeacher := models.Teacher{
		FullName: data.FullName,
		Phone:    data.Phone,
		Email:    data.Email,
		IsActive: true,
	}

	err := svc.TeacherRepo.CreateTeacher(newTeacher)
	if err != nil {
		slog.Error("❌ Failed to register new teacher record", "error", err)
		return http.StatusInternalServerError, errors.New(constants.DefaultErrorMsg)
	}

	return http.StatusCreated, nil
}
func (svc *TeacherService) GetAllTeachers() ([]models.Teacher, int, error) {
	teachers, err := svc.TeacherRepo.GetAllTeachers()
	if err != nil {
		slog.Error("❌ Failed to pull teachers collection", "error", err)
		return nil, http.StatusInternalServerError, errors.New(constants.DefaultErrorMsg)
	}
	return teachers, http.StatusOK, nil
}

func (svc *TeacherService) GetTeacherByPhone(phone string) (models.Teacher, int, error) {
	teacher, err := svc.TeacherRepo.GetTeacherByPhone(phone)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return models.Teacher{}, http.StatusNotFound, errors.New("teacher profile not found with this phone number")
		}
		slog.Error("❌ Database failure reading teacher index", "phone", phone, "error", err)
		return models.Teacher{}, http.StatusInternalServerError, errors.New(constants.DefaultErrorMsg)
	}
	return teacher, http.StatusOK, nil
}

func (svc *TeacherService) UpdateTeacher(teacherID uint, data dto.UpdateTeacherDto) (int, error) {
	// 1. Verify existence first
	existingTeacher, err := svc.TeacherRepo.GetTeacherByID(teacherID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return http.StatusNotFound, errors.New("target teacher record missing")
		}
		return http.StatusInternalServerError, errors.New(constants.DefaultErrorMsg)
	}

	// 2. Map structural updates safely
	existingTeacher.FullName = data.FullName
	existingTeacher.Phone = data.Phone
	existingTeacher.Email = data.Email
	existingTeacher.IsActive = *data.IsActive

	// 3. Persist modifications back into the ecosystem
	err = svc.TeacherRepo.UpdateTeacher(existingTeacher)
	if err != nil {
		slog.Error("❌ Failed to update teacher file row", "id", teacherID, "error", err)
		return http.StatusInternalServerError, errors.New(constants.DefaultErrorMsg)
	}

	return http.StatusOK, nil
}
