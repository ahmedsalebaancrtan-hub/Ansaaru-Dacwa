package repository

import (
	"time"

	"github.com/ahmedsaleban/ansaru_dacwa/models"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type AttendanceRepo struct {
	DB *gorm.DB
}

func NewAttendanceRepo(db *gorm.DB) *AttendanceRepo {
	return &AttendanceRepo{DB: db}
}

// Upsert: Haddii horey maanta maqnaansho looga qaaday waa lagu dul qorayaa (Update), haddii kalena waa la abuurayaa (Insert)
func (r *AttendanceRepo) MarkBulkAttendance(records []models.Attendance) error {
	return r.DB.Clauses(clause.OnConflict{
		Columns:   []clause.Column{{Name: "student_id"}, {Name: "date"}},
		DoUpdates: clause.AssignmentColumns([]string{"status", "remarks", "updated_at"}),
	}).Create(&records).Error
}

func (r *AttendanceRepo) GetByClassAndDate(classID uint, date time.Time) ([]models.Attendance, error) {
	var records []models.Attendance
	err := r.DB.Preload("Student").
		Where("class_id = ? AND date = ?", classID, date).
		Find(&records).Error
	return records, err
}

func (r *AttendanceRepo) GetByStudent(studentID uint) ([]models.Attendance, error) {
	var records []models.Attendance
	err := r.DB.Where("student_id = ?", studentID).
		Order("date desc").
		Find(&records).Error
	return records, err
}
