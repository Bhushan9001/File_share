package config

import (
	"log"

	"github.com/joho/godotenv"
)

func AddTables() {

	err := godotenv.Load()

	if err != nil {
		log.Println("No .env file found , contunuing with default values!!")
	}

	// db_name := os.Getenv("DB_NAME")

	// _, err = DB.Exec("CREATE DATABASE IF NOT EXISTS " + db_name)

	// if err != nil {
	// 	log.Fatalf("Error creating Database: %v", err.Error())
	// 	return
	// }
	_, err = DB.Exec("USE file_share;")
	
	if err != nil {
		log.Fatalf("Error Connecting DB: %v", err)
		return
	}
	_, err = DB.Exec(`CREATE TABLE IF NOT EXISTS file_metadata(
				id  varchar(255) NOT NULL,
				file_path TEXT NOT NULL,
				password TEXT NOT NULL,
				PRIMARY KEY(id)

	)`)

	if err != nil {
		log.Fatalf("Error creating Table: %v", err)
		return
	}

	log.Printf("Created Database and Table SUccessfully!!")

}
