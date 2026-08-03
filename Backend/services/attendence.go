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

type AttendanceService struct {
	repo      *repository.AttendanceRepo
	classRepo *repository.ClassRepo
}

func NewAttendanceService(repo *repository.AttendanceRepo, classRepo *repository.ClassRepo) *AttendanceService {
	return &AttendanceService{
		repo:      repo,
		classRepo: classRepo,
	}
}

func (svc *AttendanceService) MarkAttendance(data *dto.MarkBulkAttendanceDTO) (int, error) {
	// 1. Hubi in fasalku jiro
	_, err := svc.classRepo.FindById(data.ClassID)
	if err != nil {
		return http.StatusNotFound, errors.New("selected class does not exist")
	}

	// 2. Diyaari Records-ka
	var records []models.Attendance
	for _, item := range data.Attendances {
		records = append(records, models.Attendance{
			StudentID: item.StudentID,
			ClassID:   data.ClassID,
			Date:      data.Date,
			Status:    models.AttendanceStatus(item.Status),
			Remarks:   item.Remarks,
		})
	}

	// 3. Kaydi DB
	err = svc.repo.MarkBulkAttendance(records)
	if err != nil {
		slog.Error("❌ Failed to save attendance", "error", err)
		return http.StatusInternalServerError, errors.New(constants.DefaultErrorMsg)
	}

	return http.StatusOK, nil
}

func (svc *AttendanceService) GetClassAttendance(classID uint, date time.Time) ([]models.Attendance, int, error) {
	records, err := svc.repo.GetByClassAndDate(classID, date)
	if err != nil {
		slog.Error("❌ Failed to fetch class attendance", "error", err)
		return nil, http.StatusInternalServerError, errors.New(constants.DefaultErrorMsg)
	}
	return records, http.StatusOK, nil
}
