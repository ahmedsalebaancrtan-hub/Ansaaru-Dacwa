package main

import (
	"fmt"
	"log/slog"
	"net/http"
	"os"

	"github.com/ahmedsaleban/ansaru_dacwa/infra"
	"github.com/ahmedsaleban/ansaru_dacwa/routes"
	"github.com/gin-gonic/gin"
)

func corsMiddleware() gin.HandlerFunc {
	allowedOrigins := map[string]bool{
		"http://localhost:5173": true,
		"http://127.0.0.1:5173": true,
	}

	if frontendOrigin := os.Getenv("FRONTEND_ORIGIN"); frontendOrigin != "" {
		allowedOrigins[frontendOrigin] = true
	}

	return func(c *gin.Context) {
		origin := c.GetHeader("Origin")

		if allowedOrigins[origin] {
			c.Header("Access-Control-Allow-Origin", origin)
			c.Header("Vary", "Origin")
		}

		c.Header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Authorization,Content-Type,Accept,Origin")
		c.Header("Access-Control-Max-Age", "86400")

		if c.Request.Method == http.MethodOptions {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}

		c.Next()
	}
}

func main() {
	slog.Info("initialised enviroment varibale")
	infra.InitEnv()
	config := infra.Configuration
	slog.Info("Connect database successfully")
	infra.DbConnect()
	slog.Info("Connect database succesfully")
	r := gin.Default()
	r.Use(corsMiddleware())
	routes.RegIsterRouter(r)
	slog.Info("application is running successfully on port 9000")
	r.Run(fmt.Sprintf(":%s", config.Port))
}
