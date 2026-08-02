package repository

import (
	"github.com/ahmedsaleban/ansaru_dacwa/models"
	"gorm.io/gorm"
)

type SubjectRepo struct {
	DB *gorm.DB
}

func NewSubjectRepo(db *gorm.DB) *SubjectRepo {
	return &SubjectRepo{
		DB: db,
	}
}

func (r *SubjectRepo) CreateBulk(subjects []models.Subject) error {
	return r.DB.Create(&subjects).Error
}

func (r *SubjectRepo) FindAll() ([]models.Subject, error) {
	var subjects []models.Subject
	err := r.DB.Preload("Class").Find(&subjects).Error
	return subjects, err
}

func (r *SubjectRepo) FindByClassID(classID uint) ([]models.Subject, error) {
	var subjects []models.Subject
	err := r.DB.Where("class_id = ?", classID).Find(&subjects).Error
	return subjects, err
}

func (r *SubjectRepo) FindByID(id uint) (models.Subject, error) {
	var subject models.Subject
	err := r.DB.Preload("Class").Where("id = ?", id).First(&subject).Error
	return subject, err
}

func (r *SubjectRepo) Update(subject models.Subject) error {
	return r.DB.Save(&subject).Error
}

func (r *SubjectRepo) Delete(id uint) error {
	return r.DB.Delete(&models.Subject{}, id).Error
}
