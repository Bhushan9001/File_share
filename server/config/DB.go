package config

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	_ "github.com/go-sql-driver/mysql"
	"github.com/joho/godotenv"
)

var DB *sql.DB

func InitDB() {

	var err error

	err = godotenv.Load()

	if err != nil {
		log.Println("No .env file found , contunuing with default values!!")
	}

	db_user := os.Getenv("DB_USER")
	db_host := os.Getenv("DB_HOST")
	db_password := os.Getenv("DB_PASSWORD")
	db_port := os.Getenv("DB_PORT")

	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/?charset=utf8mb4&parseTime=True&loc=Local",
		db_user, db_password, db_host, db_port)

	DB, err = sql.Open("mysql", dsn)

	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	AddTables()

	if err != nil {
		log.Fatalf("Error selecting database: %v", err)
	}

	if err = DB.Ping(); err != nil {
		log.Fatalf("Error connecting database: %v", err)
	}

	log.Println("Database Connected Successfully!!")

}

func CloseDB() {

	if DB != nil {
		DB.Close()
		log.Println("Database connection closed.")
	}

}
