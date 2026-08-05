package services

import (
	"errors"
	"fmt"
	"log/slog"
	"net/http"
	"strings"
	"time"

	"github.com/ahmedsaleban/ansaru_dacwa/constants"
	"github.com/ahmedsaleban/ansaru_dacwa/dto"
	"github.com/ahmedsaleban/ansaru_dacwa/helpers"
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

	// 4. (Optional Auto-Alert): Asynchronous-ka fariinta WhatsApp-ka ah ugu dir waalidiinta ardayda baaqatay
	go svc.SendAbsentAlertsByDateAndClass(data.ClassID, data.Date)

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

// 🟢 5. SendAbsentAlertsByDateAndClass - Wuxuu WhatsApp u dirayaa ardayda 'ABSENT' ku ah fasal iyo taariikh go'an
func (svc *AttendanceService) SendAbsentAlertsByDateAndClass(classID uint, date time.Time) (int, error) {
	type AbsentStudentResult struct {
		FullName       string
		ParentOnePhone string
	}

	var absentStudents []AbsentStudentResult

	// SQL Query - Wuxuu soo jiidayaa ardayda fasalkaas ka baaqatay taariikhdaas
	err := svc.repo.DB.Raw(`
		SELECT s.full_name, f.parent_one_phone
		FROM attendances a
		JOIN students s ON a.student_id = s.id
		JOIN families f ON s.family_id = f.id
		WHERE a.class_id = ? 
		  AND DATE(a.date) = DATE(?) 
		  AND LOWER(TRIM(a.status)) = 'absent'
	`, classID, date).Scan(&absentStudents).Error

	if err != nil {
		slog.Error("❌ Failed to fetch absent students", "error", err)
		return 0, fmt.Errorf("failed to fetch absent students: %v", err)
	}

	formattedDate := date.Format("2006-01-02")
	sentCount := 0

	slog.Info("🔍 Checking absent students...", "count", len(absentStudents), "date", formattedDate)

	for _, item := range absentStudents {
		phone := strings.TrimSpace(item.ParentOnePhone)
		if phone != "" {
			msg := fmt.Sprintf(
				"⚠️ *OGEYSIIS MAQNAANSHO*\n\n"+
					"Asc Waalid, Waxaa laguu sheegayaa in ardayga *%s* uu maanta (%s) ka baaqday dugsiga.\n\n"+
					"Fadlan maamulka dugsiga nagala soo xiriir sababta uu u baaqday. Mahadsanid!",
				item.FullName, formattedDate,
			)

			errMsg := helpers.SendWhatsAppMessage(phone, msg)
			if errMsg != nil {
				slog.Error("❌ Failed to send WhatsApp absent alert", "phone", phone, "error", errMsg)
			} else {
				slog.Info("✅ Absent WhatsApp alert sent", "student", item.FullName, "phone", phone)
				sentCount++
			}
		}
	}

	return sentCount, nil
}
