package middleware

import (
	"log/slog"
	"net/http"
	"strings"

	"github.com/ahmedsaleban/ansaru_dacwa/helpers"
	"github.com/ahmedsaleban/ansaru_dacwa/infra"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

func Authenticated() gin.HandlerFunc {
	return func(c *gin.Context) {

		authHeader := c.GetHeader("Authorization")

		if authHeader == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"is_success": false,
				"message":    "Missing Authorization header",
			})
			return
		}

		if !strings.HasPrefix(authHeader, "Bearer ") {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"is_success": false,
				"message":    "Invalid Authorization header",
			})
			return
		}

		tokenString := strings.TrimPrefix(authHeader, "Bearer ")

		claims := &helpers.Claims{}

		token, err := jwt.ParseWithClaims(
			tokenString,
			claims,
			func(token *jwt.Token) (interface{}, error) {

				if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
					return nil, jwt.ErrSignatureInvalid
				}

				return []byte(infra.Configuration.Access_jwt_Token), nil
			},
		)

		if err != nil || !token.Valid {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"is_success": false,
				"message":    "Unauthenticated",
			})
			return
		}

		if claims.IsRefreshToken {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"is_success": false,
				"message":    "Refresh token cannot access this endpoint",
			})
			return
		}

		c.Set("user_id", claims.UserID)
		c.Set("userId", claims.UserID)
		c.Set("email", claims.Subject)
		c.Set("role", string(claims.Role))

		slog.Info(
			"Authenticated",
			"userID", claims.UserID,
			"email", claims.Subject,
			"role", string(claims.Role),
		)

		c.Next()
	}
}

func RefreshAuthenticated() gin.HandlerFunc {
	return func(c *gin.Context) {

		authHeader := c.GetHeader("Authorization")

		if authHeader == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"is_success": false,
				"message":    "Missing Authorization header",
			})
			return
		}

		if !strings.HasPrefix(authHeader, "Bearer ") {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"is_success": false,
				"message":    "Invalid Authorization header",
			})
			return
		}

		tokenString := strings.TrimPrefix(authHeader, "Bearer ")

		claims := &helpers.Claims{}

		token, err := jwt.ParseWithClaims(
			tokenString,
			claims,
			func(token *jwt.Token) (interface{}, error) {

				if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
					return nil, jwt.ErrSignatureInvalid
				}

				return []byte(infra.Configuration.Refresh_jwt_token), nil
			},
		)

		if err != nil || !token.Valid {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"is_success": false,
				"message":    "Invalid refresh token",
			})
			return
		}
		slog.Info(
			"Refresh Claims",
			"email", claims.Subject,
			"role", claims.Role,
			"userID", claims.UserID,
			"isRefresh", claims.IsRefreshToken,
		)
		if !claims.IsRefreshToken {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"is_success": false,
				"message":    "Access token cannot be used here",
			})
			return
		}

		c.Set("user_id", claims.UserID)
		c.Set("user_email", claims.Subject)
		c.Set("role", string(claims.Role))

		c.Next()
	}
}
