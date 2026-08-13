package repository

import (
	"github.com/ahmedsaleban/ansaru_dacwa/models"
	"gorm.io/gorm"
)

type ClassRepo struct {
	DB *gorm.DB
}

func NewClassRegister(db *gorm.DB) ClassRepo {
	return ClassRepo{
		DB: db,
	}
}

func (r *ClassRepo) CreateClass(data models.Class) error {
	return r.DB.Create(&data).Error

}
func (r *ClassRepo) FindAll() ([]models.Class, error) {
	var class []models.Class

	err := r.DB.Find(&class).Error

	if err != nil {
		return nil, err
	}
	return class, nil

}

func (r *ClassRepo) FindById(id uint) (models.Class, error) {
	var class models.Class

	err := r.DB.Where("id = ?", id).First(&class).Error

	if err != nil {
		return models.Class{}, err
	}
	return class, nil
}

func (r *ClassRepo) UpdateClass(data models.Class) error {

	return r.DB.Save(data).Error

}
