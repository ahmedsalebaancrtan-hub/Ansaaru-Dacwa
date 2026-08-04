package services

import (
	"errors"
	"fmt"
	"net/http"
	"time"

	"github.com/ahmedsaleban/ansaru_dacwa/dto"
	"github.com/ahmedsaleban/ansaru_dacwa/helpers"
	"github.com/ahmedsaleban/ansaru_dacwa/models"
	"github.com/ahmedsaleban/ansaru_dacwa/repository"
)

type ExamService struct {
	repo *repository.ExamRepo
}

func NewExamService(repo *repository.ExamRepo) *ExamService {
	return &ExamService{repo: repo}
}

func (svc *ExamService) CreateExam(data dto.CreateExamDTO) (models.Exam, int, error) {
	exam := models.Exam{
		Title:        data.Title,
		AcademicYear: data.AcademicYear,
		Term:         data.Term,
		ExamType:     models.ExamType(data.ExamType),
		MaxMarks:     data.MaxMarks,
	}

	err := svc.repo.CreateExam(&exam)
	if err != nil {
		return models.Exam{}, http.StatusInternalServerError, errors.New("failed to create exam session")
	}

	return exam, http.StatusCreated, nil
}
func (svc *ExamService) SubmitMarks(data dto.BulkMarksDTO) (int, error) {
	exam, err := svc.repo.GetExamByID(data.ExamID)
	if err != nil {
		return http.StatusNotFound, errors.New("exam record not found")
	}

	var marksRecords []models.StudentMark

	for _, m := range data.Marks {
		// 🛑 HUBIN 1: Hubi in Ardaygu DB-ga ku jiro
		var studentCount int64
		svc.repo.DB.Model(&models.Student{}).Where("id = ?", m.StudentID).Count(&studentCount)
		if studentCount == 0 {
			return http.StatusBadRequest, fmt.Errorf("arday leh ID: %d ma jiro DB-ga, fadlan xaqiiji Excel-ka", m.StudentID)
		}

		if m.MarksObtained > exam.MaxMarks {
			return http.StatusBadRequest, fmt.Errorf("marks (%.1f) cannot exceed maximum allowed marks (%.1f)", m.MarksObtained, exam.MaxMarks)
		}

		grade := helpers.CalculateGrade(m.MarksObtained, exam.MaxMarks)

		marksRecords = append(marksRecords, models.StudentMark{
			ExamID:        data.ExamID,
			StudentID:     m.StudentID,
			SubjectID:     m.SubjectID,
			MarksObtained: m.MarksObtained,
			Grade:         grade,
			Remarks:       m.Remarks,
			UpdatedAt:     time.Now(),
		})
	}

	err = svc.repo.SaveMarks(marksRecords)
	if err != nil {
		return http.StatusInternalServerError, errors.New("failed to save student marks")
	}

	return http.StatusOK, nil
}

func (svc *ExamService) GetReportCard(studentID uint, examID uint) (map[string]interface{}, int, error) {
	marks, err := svc.repo.GetStudentReportCard(studentID, examID)
	if err != nil || len(marks) == 0 {
		return nil, http.StatusNotFound, errors.New("no marks found for this student in the specified exam")
	}

	var totalObtained float64 = 0
	var totalMax float64 = 0

	for _, m := range marks {
		totalObtained += m.MarksObtained
		totalMax += m.Exam.MaxMarks
	}

	percentage := (totalObtained / totalMax) * 100
	overallGrade := helpers.CalculateGrade(totalObtained, totalMax)

	report := map[string]interface{}{
		"student":        marks[0].Student,
		"exam":           marks[0].Exam,
		"subject_marks":  marks,
		"total_obtained": totalObtained,
		"total_max":      totalMax,
		"percentage":     percentage,
		"overall_grade":  overallGrade,
	}

	return report, http.StatusOK, nil
}
