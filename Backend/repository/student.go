package repository

import (
	"github.com/ahmedsaleban/ansaru_dacwa/models"
	"gorm.io/gorm"
)

type StudentRepo struct {
	DB *gorm.DB
}

func NewStudentRepo(db *gorm.DB) *StudentRepo {
	return &StudentRepo{
		DB: db,
	}
}

func (r *StudentRepo) CreateStudent(student *models.Student) error {
	return r.DB.Create(student).Error
}

func (r *StudentRepo) ListStudent() ([]models.Student, error) {
	var students []models.Student
	if err := r.DB.Preload("Class").Preload("Family").Find(&students).Error; err != nil {
		return nil, err
	}
	return students, nil
}

func (r *StudentRepo) GetStudentByID(studentID uint) (models.Student, error) {
	var student models.Student
	err := r.DB.Preload("Class").Preload("Family").Where("id = ?", studentID).First(&student).Error
	if err != nil {
		return models.Student{}, err
	}
	return student, nil
}

func (r *StudentRepo) UpdateStudent(student models.Student) error {
	return r.DB.Save(&student).Error
}

func (r *StudentRepo) DeleteStudent(id uint) error {
	return r.DB.Delete(&models.Student{}, id).Error
}

func (r *StudentRepo) PromoteStudents(studentIDs []uint, toClassID uint) error {
	return r.DB.Model(&models.Student{}).
		Where("id IN ?", studentIDs).
		Update("class_id", toClassID).Error
}
