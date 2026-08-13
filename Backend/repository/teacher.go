package repository

import (
	"github.com/ahmedsaleban/ansaru_dacwa/models"
	"gorm.io/gorm"
)

type TeacherRepo struct {
	DB *gorm.DB
}

func NewTeacherRepo(db *gorm.DB) *TeacherRepo {
	return &TeacherRepo{
		DB: db,
	}
}

func (r *TeacherRepo) CreateTeacher(data models.Teacher) error {
	return r.DB.Create(&data).Error
}

func (r *TeacherRepo) GetTeacherByID(teacherID uint) (models.Teacher, error) {
	var teacher models.Teacher
	err := r.DB.First(&teacher, teacherID).Error
	return teacher, err
}
func (r *TeacherRepo) GetAllTeachers() ([]models.Teacher, error) {
	var teachers []models.Teacher
	err := r.DB.Find(&teachers).Error
	return teachers, err
}

// GetTeacherByPhone looks up unique records by phone indices
func (r *TeacherRepo) GetTeacherByPhone(phone string) (models.Teacher, error) {
	var teacher models.Teacher
	err := r.DB.Where("phone = ?", phone).First(&teacher).Error
	return teacher, err
}

// UpdateTeacher modifies existing database rows completely
func (r *TeacherRepo) UpdateTeacher(teacher models.Teacher) error {
	return r.DB.Save(&teacher).Error
}
