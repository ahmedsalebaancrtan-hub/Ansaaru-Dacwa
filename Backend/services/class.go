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

type ClassService struct {
	classRepo repository.ClassRepo
}

func RegisterClassRepo(repo *repository.ClassRepo) *ClassService {
	return &ClassService{
		classRepo: *repo,
	}

}

func (svc *ClassService) CreateClass(data *dto.CreateClassdto) (int, models.Class, error) {
	var NewClass = models.Class{
		Title:        data.Title,
		AcademicYear: data.AcademicYear,
	}

	err := svc.classRepo.CreateClass(NewClass)

	if err != nil {

		return http.StatusInternalServerError, models.Class{}, errors.New(constants.DefaultErrorMsg)
	}

	return http.StatusCreated, NewClass, nil
}

func (svc *ClassService) FindAll() (int, []models.Class, error) {

	data, err := svc.classRepo.FindAll()

	if err != nil {
		return http.StatusInternalServerError, nil, err
	}

	return http.StatusOK, data, nil
}
func (svc *ClassService) FindById(id uint) (int, models.Class, error) {

	data, err := svc.classRepo.FindById(id)

	if err != nil {
		return http.StatusInternalServerError, models.Class{}, err
	}

	return http.StatusOK, data, nil
}

func (svc *ClassService) UpdateClass(id uint, data dto.UpdateClassdto) (int, error) {
	class, err := svc.classRepo.FindById(id)
	if err != nil {
		return http.StatusNotFound, errors.New(constants.NotFound)
	}

	var UpdatedClassdata = models.Class{
		ID:           class.ID,
		CreatedAt:    class.CreatedAt,
		Title:        data.Title,
		AcademicYear: data.AcademicYear,
	}

	err = svc.classRepo.UpdateClass(UpdatedClassdata)

	if err != nil {
		slog.Error("failed to update class", "error", err)
		return http.StatusInternalServerError, errors.New(constants.DefaultErrorMsg)
	}

	return http.StatusOK, nil
}
