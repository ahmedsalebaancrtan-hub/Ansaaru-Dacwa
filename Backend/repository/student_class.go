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

func (r *StudentClassRepo) AddStudentClass(studentID uint, classID uint) error {
	return r.DB.Create(&models.StudentClass{
		ClassID:   classID,
		StudentID: studentID,
		IsActive:  true,
	}).Error
}

func (r *StudentClassRepo) GetActiveClass(studentID uint) (models.StudentClass, error) {
	var studentClass models.StudentClass
	err := r.DB.Where("student_id = ? AND is_active = ?", studentID, true).First(&studentClass).Error
	if err != nil {
		return models.StudentClass{}, err
	}
	return studentClass, nil
}

func (r *StudentClassRepo) DeactivateStudentClass(studentID uint) error {
	return r.DB.Model(&models.StudentClass{}).
		Where("student_id = ? AND is_active = ?", studentID, true).
		Update("is_active", false).Error
}

func (r *StudentClassRepo) GetClassStudents(classID uint) ([]models.StudentClass, error) {
	var classStudents []models.StudentClass
	err := r.DB.Preload("Class").
		Preload("Student").
		Where("class_id = ? AND is_active = ?", classID, true). // Soo ciyaara kaliya ardayda active-ka ku ah fasalkan
		Find(&classStudents).Error

	if err != nil {
		return nil, err
	}
	return classStudents, nil
}
