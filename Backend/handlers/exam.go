package handlers

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/ahmedsaleban/ansaru_dacwa/dto"
	"github.com/ahmedsaleban/ansaru_dacwa/infra"
	"github.com/ahmedsaleban/ansaru_dacwa/repository"
	"github.com/ahmedsaleban/ansaru_dacwa/services"
	"github.com/gin-gonic/gin"
	"github.com/xuri/excelize/v2"
)

type ExamHandler struct {
	svc *services.ExamService
}

func RegisterExamHandler() *ExamHandler {
	repo := repository.NewExamRepo(infra.DB)
	svc := services.NewExamService(repo)
	return &ExamHandler{svc: svc}
}

func (h *ExamHandler) CreateExam(c *gin.Context) {
	var body dto.CreateExamDTO
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"is_success": false, "message": err.Error()})
		return
	}

	exam, status, err := h.svc.CreateExam(body)
	if err != nil {
		c.JSON(status, gin.H{"is_success": false, "message": err.Error()})
		return
	}

	c.JSON(status, gin.H{"is_success": true, "message": "Exam session created", "data": exam})
}

func (h *ExamHandler) SubmitMarks(c *gin.Context) {
	var body dto.BulkMarksDTO
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"is_success": false, "message": err.Error()})
		return
	}

	status, err := h.svc.SubmitMarks(body)
	if err != nil {
		c.JSON(status, gin.H{"is_success": false, "message": err.Error()})
		return
	}

	c.JSON(status, gin.H{"is_success": true, "message": "Marks recorded successfully"})
}

func (h *ExamHandler) GetReportCard(c *gin.Context) {
	studentID, _ := strconv.Atoi(c.Param("student_id"))
	examID, _ := strconv.Atoi(c.Param("exam_id"))

	report, status, err := h.svc.GetReportCard(uint(studentID), uint(examID))
	if err != nil {
		c.JSON(status, gin.H{"is_success": false, "message": err.Error()})
		return
	}

	c.JSON(status, gin.H{"is_success": true, "data": report})
}
func (h *ExamHandler) UploadMarksExcel(c *gin.Context) {
	// 1. Soo qaad multipart file-ka Postman/Frontend ka soo diray
	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"is_success": false, "message": "Faylka Excel-ka ah waa muhiim (key: file)"})
		return
	}

	// 2. Soo qaad parameters-ka kale
	examID, _ := strconv.Atoi(c.PostForm("exam_id"))
	subjectID, _ := strconv.Atoi(c.PostForm("subject_id"))

	if examID == 0 || subjectID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"is_success": false, "message": "exam_id iyo subject_id waa muhiim"})
		return
	}

	src, err := file.Open()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"is_success": false, "message": "Faylka waa la furi waayay"})
		return
	}
	defer src.Close()

	// 3. Akhri Excel Sheet-ka
	f, err := excelize.OpenReader(src)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"is_success": false, "message": "Format-ka Excel-ka ma saxna"})
		return
	}

	sheetName := f.GetSheetName(0) // Sheet-ka 1-aad
	rows, err := f.GetRows(sheetName)
	if err != nil || len(rows) <= 1 {
		c.JSON(http.StatusBadRequest, gin.H{"is_success": false, "message": "Excel-ku waa eber ama xog maleh"})
		return
	}

	var marksList []dto.MarkEntryDTO

	// 4. Loop ku samee safarada (Rows) - Bishi Header-ka (Row 0)
	for i, row := range rows {
		if i == 0 {
			continue // Ka bixid header-ka ("Student ID", "Marks Obtained", "Remarks")
		}

		if len(row) < 2 {
			continue
		}

		studentID, _ := strconv.Atoi(row[0])
		marksObtained, _ := strconv.ParseFloat(row[1], 64)

		remarks := ""
		if len(row) >= 3 {
			remarks = row[2]
		}

		if studentID > 0 {
			marksList = append(marksList, dto.MarkEntryDTO{
				StudentID:     uint(studentID),
				SubjectID:     uint(subjectID),
				MarksObtained: marksObtained,
				Remarks:       remarks,
			})
		}
	}

	// 5. U dir Service-kii hore ee SubmitMarks
	bulkDTO := dto.BulkMarksDTO{
		ExamID: uint(examID),
		Marks:  marksList,
	}

	status, err := h.svc.SubmitMarks(bulkDTO)
	if err != nil {
		c.JSON(status, gin.H{"is_success": false, "message": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"is_success": true,
		"message":    fmt.Sprintf("Waxaa si guul leh loo geliyay buundooyinka %d arday!", len(marksList)),
	})
}
