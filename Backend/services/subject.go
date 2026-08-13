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

type SubjectService struct {
	subjectRepo repository.SubjectRepo
	classRepo   repository.ClassRepo
}

func RegisterSubjectService(repo *repository.SubjectRepo, classRepo *repository.ClassRepo) *SubjectService {
	return &SubjectService{
		subjectRepo: *repo,
		classRepo:   *classRepo,
	}
}

func (svc *SubjectService) AssignSubjects(data *dto.AssignSubjectsDTO) (int, []models.Subject, error) {
	// 1. Verify Class Exists
	_, err := svc.classRepo.FindById(data.ClassID)
	if err != nil {
		return http.StatusNotFound, nil, errors.New("selected class does not exist")
	}

	// 2. Prepare models for bulk insertion
	var subjectsToCreate []models.Subject
	for _, item := range data.Subjects {
		subjectsToCreate = append(subjectsToCreate, models.Subject{
			Name:    item.Name,
			Marks:   item.Marks,
			ClassID: data.ClassID,
		})
	}

	// 3. Save to database
	err = svc.subjectRepo.CreateBulk(subjectsToCreate)
	if err != nil {
		slog.Error("failed to assign subjects", "error", err)
		return http.StatusInternalServerError, nil, errors.New(constants.DefaultErrorMsg)
	}

	return http.StatusCreated, subjectsToCreate, nil
}

func (svc *SubjectService) FindAll() (int, []models.Subject, error) {
	data, err := svc.subjectRepo.FindAll()
	if err != nil {
		return http.StatusInternalServerError, nil, err
	}
	return http.StatusOK, data, nil
}

func (svc *SubjectService) FindByClassID(classID uint) (int, []models.Subject, error) {
	data, err := svc.subjectRepo.FindByClassID(classID)
	if err != nil {
		return http.StatusInternalServerError, nil, err
	}
	return http.StatusOK, data, nil
}

func (svc *SubjectService) UpdateSubject(id uint, data dto.UpdateSubjectDTO) (int, error) {
	subject, err := svc.subjectRepo.FindByID(id)
	if err != nil {
		return http.StatusNotFound, errors.New(constants.NotFound)
	}

	subject.Name = data.Name
	subject.Marks = data.Marks

	err = svc.subjectRepo.Update(subject)
	if err != nil {
		slog.Error("failed to update subject", "error", err)
		return http.StatusInternalServerError, errors.New(constants.DefaultErrorMsg)
	}

	return http.StatusOK, nil
}

func (svc *SubjectService) DeleteSubject(id uint) (int, error) {
	_, err := svc.subjectRepo.FindByID(id)
	if err != nil {
		return http.StatusNotFound, errors.New(constants.NotFound)
	}

	err = svc.subjectRepo.Delete(id)
	if err != nil {
		return http.StatusInternalServerError, errors.New(constants.DefaultErrorMsg)
	}

	return http.StatusOK, nil
}
