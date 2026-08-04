package dto

type CreateExamDTO struct {
	Title        string  `json:"title" binding:"required"`
	AcademicYear string  `json:"academic_year" binding:"required"`
	Term         string  `json:"term" binding:"required"`
	ExamType     string  `json:"exam_type" binding:"required"`
	MaxMarks     float64 `json:"max_marks" binding:"required,gt=0"`
}

type MarkEntryDTO struct {
	StudentID     uint    `json:"student_id" binding:"required"`
	SubjectID     uint    `json:"subject_id" binding:"required"`
	MarksObtained float64 `json:"marks_obtained" binding:"required,gte=0"`
	Remarks       string  `json:"remarks"`
}

type BulkMarksDTO struct {
	ExamID uint           `json:"exam_id" binding:"required"`
	Marks  []MarkEntryDTO `json:"marks" binding:"required,gt=0"`
}
