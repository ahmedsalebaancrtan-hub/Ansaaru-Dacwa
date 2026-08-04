package infra

import (
	"fmt"

	"github.com/ahmedsaleban/ansaru_dacwa/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func DbConnect() {
	config := Configuration
	dsn := fmt.Sprintf("host=%s user=%s password=%s port=%s dbname=%s sslmode=disable", config.DbHost, config.DbUser, config.DbPassword, config.DbPort, config.DbName)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})

	if err != nil {
		panic("failed to connect database")
	}
	err = db.AutoMigrate(
		&models.User{},
		&models.PasswordResetToken{},
		&models.Class{},
		&models.Family{},
		&models.Student{},
		&models.StudentClass{},
		&models.Employee{},
		&models.Subject{},
		&models.Attendance{},
		&models.StudentPayment{},
		// <-- Make sure pointers (&) are used
	)

	if err != nil {
		fmt.Printf("❌ Migration Failed: %v\n", err)
	} else {
		fmt.Println("✅ Database Migrated Successfully!")
	}

	DB = db

}
