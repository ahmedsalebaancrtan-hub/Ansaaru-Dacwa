package repository

import (
	"github.com/ahmedsaleban/ansaru_dacwa/models"
	"gorm.io/gorm"
)

type FamilyRepo struct {
	DB *gorm.DB
}

func NewFamilyRepo(db *gorm.DB) *FamilyRepo {
	return &FamilyRepo{
		DB: db,
	}
}

func (r *FamilyRepo) CreateFamily(data models.Family) error {
	return r.DB.Create(&data).Error
}

func (r *FamilyRepo) GetfamilyByID(FamilyID uint) (models.Family, error) {
	var family models.Family

	err := r.DB.First(&family, FamilyID).Error
	if err != nil {
		return models.Family{}, err
	}

	return family, nil
}

func (r *FamilyRepo) ListFamily() ([]models.Family, error) {
	var families []models.Family
	err := r.DB.Find(&families).Error
	if err != nil {
		return nil, err
	}
	return families, nil
}
