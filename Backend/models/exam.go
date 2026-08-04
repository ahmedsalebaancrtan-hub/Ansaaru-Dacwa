package models

import "time"

type ExamType string

const (
	ExamTypeMidTerm ExamType = "MID_TERM"
	ExamTypeFinal   ExamType = "FINAL"
	ExamTypeQuiz    ExamType = "QUIZ"
)

type Exam struct {
	ID           uint      `json:"id" gorm:"primaryKey"`
	Title        string    `json:"title" gorm:"not null"`         // e.g. "Mid-Term Exam"
	AcademicYear string    `json:"academic_year" gorm:"not null"` // e.g. "2026-2027"
	Term         string    `json:"term" gorm:"not null"`          // e.g. "Term 1"
	ExamType     ExamType  `json:"exam_type" gorm:"type:varchar(20);not null"`
	MaxMarks     float64   `json:"max_marks" gorm:"default:100"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

// Buundooyinka ardaygu ka helay maadda go'an
type StudentMark struct {
	ID            uint      `json:"id" gorm:"primaryKey"`
	ExamID        uint      `json:"exam_id" gorm:"not null;uniqueIndex:idx_exam_student_subject"`
	Exam          Exam      `json:"exam" gorm:"foreignKey:ExamID"`
	StudentID     uint      `json:"student_id" gorm:"not null;uniqueIndex:idx_exam_student_subject"`
	Student       Student   `json:"student" gorm:"foreignKey:StudentID"`
	SubjectID     uint      `json:"subject_id" gorm:"not null;uniqueIndex:idx_exam_student_subject"`
	Subject       Subject   `json:"subject" gorm:"foreignKey:SubjectID"`
	MarksObtained float64   `json:"marks_obtained" gorm:"not null"`
	Grade         string    `json:"grade" gorm:"type:varchar(5)"` // A, B, C, D, F
	Remarks       string    `json:"remarks"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
}
