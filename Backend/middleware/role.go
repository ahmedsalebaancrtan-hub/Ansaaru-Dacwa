package middleware

import (
	"net/http"
	"slices"

	"github.com/gin-gonic/gin"
)

func RequiredRole(allowedRoles ...string) gin.HandlerFunc {
	return func(c *gin.Context) {

		role := c.GetString("role")

		if role == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"is_success": false,
				"message":    "Role not found",
			})
			return
		}

		if !slices.Contains(allowedRoles, role) {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{
				"is_success": false,
				"message":    "You don't have the required role",
				"your_role":  role,
			})
			return
		}

		c.Next()
	}
}
