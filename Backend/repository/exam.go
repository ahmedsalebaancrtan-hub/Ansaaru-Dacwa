package repository

import (
	"github.com/ahmedsaleban/ansaru_dacwa/models"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type ExamRepo struct {
	DB *gorm.DB
}

func NewExamRepo(db *gorm.DB) *ExamRepo {
	return &ExamRepo{DB: db}
}

func (r *ExamRepo) CreateExam(exam *models.Exam) error {
	return r.DB.Create(exam).Error
}

func (r *ExamRepo) GetExamByID(id uint) (models.Exam, error) {
	var exam models.Exam
	err := r.DB.First(&exam, id).Error
	return exam, err
}

func (r *ExamRepo) SaveMarks(marks []models.StudentMark) error {
	return r.DB.Clauses(clause.OnConflict{
		Columns:   []clause.Column{{Name: "exam_id"}, {Name: "student_id"}, {Name: "subject_id"}},
		DoUpdates: clause.AssignmentColumns([]string{"marks_obtained", "grade", "remarks", "updated_at"}),
	}).Create(&marks).Error
}

func (r *ExamRepo) GetStudentReportCard(studentID uint, examID uint) ([]models.StudentMark, error) {
	var marks []models.StudentMark
	err := r.DB.
		Preload("Exam").
		Preload("Student").
		Preload("Student.Class").
		Preload("Subject").
		Where("student_id = ? AND exam_id = ?", studentID, examID).
		Find(&marks).Error
	return marks, err
}
