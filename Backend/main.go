package main

import (
	"fmt"
	"log/slog"

	"github.com/ahmedsaleban/ansaru_dacwa/infra"
	"github.com/ahmedsaleban/ansaru_dacwa/routes"
	"github.com/gin-gonic/gin"
)

func main() {
	slog.Info("initialised enviroment varibale")
	infra.InitEnv()
	config := infra.Configuration
	slog.Info("Connect database successfully")
	infra.DbConnect()
	slog.Info("Connect database succesfully")
	r := gin.Default()
	routes.RegIsterRouter(r)
	slog.Info("application is running successfully on port 9000")
	r.Run(fmt.Sprintf(":%s", config.Port))
}
