package services

import (
	"errors"
	"log/slog"
	"net/http"

	"github.com/ahmedsaleban/ansaru_dacwa/constants"
	"github.com/ahmedsaleban/ansaru_dacwa/dto"
	"github.com/ahmedsaleban/ansaru_dacwa/models"
	"github.com/ahmedsaleban/ansaru_dacwa/repository"
)

type FamilyService struct {
	FamilyRepo repository.FamilyRepo
}

func NewFamilyService(FamilyRepo repository.FamilyRepo) *FamilyService {
	return &FamilyService{
		FamilyRepo: FamilyRepo,
	}
}

func (svc *FamilyService) CreateFamily(data dto.CreateFamilydto) (int, error) {

	NewFamily := models.Family{
		FamilyName:     data.FamilyName,
		ParentOneName:  data.ParentOneName,
		ParentOnePhone: data.ParentOnePhone,
		ParentTwoName:  data.ParentTwoName,
		ParentTwoPhone: data.ParentTwoPhone,
		Address:        data.Address,
	}

	err := svc.FamilyRepo.CreateFamily(NewFamily)

	if err != nil {
		slog.Error("❌Failed to create family ", "error", err)
		return http.StatusInternalServerError, errors.New(constants.DefaultErrorMsg)
	}

	return http.StatusCreated, nil

}
