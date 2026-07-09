package helpers

import (
	"time"

	"github.com/ahmedsaleban/ansaru_dacwa/infra"
	"github.com/ahmedsaleban/ansaru_dacwa/models"
	"github.com/golang-jwt/jwt/v5"
)

type Claims struct {
	UserID         uint        `json:"userID"`
	Role           models.Role `json:"role"`
	IsRefreshToken bool        `json:"isRefreshToken"`
	jwt.RegisteredClaims
}

func GenerateJwt(
	role models.Role,
	userID uint,
	email string,
	expireAt int64,
	isRefreshToken bool,
) (string, error) {

	var secret []byte

	if isRefreshToken {
		secret = []byte(infra.Configuration.Refresh_jwt_token)
	} else {
		secret = []byte(infra.Configuration.Access_jwt_Token)
	}

	claims := Claims{
		UserID:         userID,
		Role:           role,
		IsRefreshToken: isRefreshToken,
		RegisteredClaims: jwt.RegisteredClaims{
			Subject:   email,
			ExpiresAt: jwt.NewNumericDate(time.Unix(expireAt, 0)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			NotBefore: jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	return token.SignedString(secret)
}
