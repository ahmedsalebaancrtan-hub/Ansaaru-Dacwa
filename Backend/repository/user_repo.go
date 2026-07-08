package repository

import (
	"github.com/ahmedsaleban/ansaru_dacwa/models"
	"gorm.io/gorm"
)

type UserRepo struct {
	DB *gorm.DB
}

func RegisterRepo(db *gorm.DB) *UserRepo {
	return &UserRepo{
		DB: db,
	}
}

func (repo *UserRepo) CreateUser(data models.User) error {
	return repo.DB.Create(&data).Error
}

func (repo *UserRepo) GetUserByEmail(email string) (models.User, error) {

	var user models.User

	err := repo.DB.Where("email_address = ?", email).First(&user).Error

	if err != nil {
		return models.User{}, err
	}
	return user, nil
}
func (repo *UserRepo) GetUserByID(id uint) (*models.User, error) {
	var user models.User

	err := repo.DB.First(&user, id).Error
	if err != nil {
		return nil, err
	}

	return &user, nil
}
