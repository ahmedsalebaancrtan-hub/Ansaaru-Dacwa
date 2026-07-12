package repository

import (
	"github.com/ahmedsaleban/ansaru_dacwa/models"
	"gorm.io/gorm"
)

type StudentClassRepo struct {
	DB *gorm.DB
}

func NewStudentClassRepo(db *gorm.DB) *StudentClassRepo {
	return &StudentClassRepo{
		DB: db,
	}
}

func (r *StudentClassRepo) AddStudentClass(StudentId uint, ClassId uint) error {
	return r.DB.Create(&models.StudentClass{
		ClassID:   ClassId,
		StudentID: StudentId,
		Is_active: true,
	}).Error
}

func (r *StudentClassRepo) GetActiveClass(StudentId uint) (models.StudentClass, error) {
	var studenclass models.StudentClass

	err := r.DB.Where("student_id = ? 	AND is_active = ?", StudentId, true).First(&studenclass).Error

	if err != nil {
		return models.StudentClass{}, err
	}
	return studenclass, nil
}

func (r *StudentClassRepo) DeactiveStudentClass(StudentID uint) error {
	return r.DB.Model(models.StudentClass{}).Where("student_id = ? AND  is_active = ?", StudentID, true).Update("is_active", false).Error
}

func (r *StudentClassRepo) GetClassStudent(classId uint) ([]models.StudentClass, error) {
	var classStudents []models.StudentClass

	err := r.DB.Preload("Class").
		Preload("Student").
		Where("class_id = ?", classId).
		Find(&classStudents).Error

	if err != nil {
		return nil, err
	}
	return classStudents, nil
}
