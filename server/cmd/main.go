package main

import (
	"log"
	"os"
	"path/filepath"

	"github.com/Bhushan9001/file_share_go/config"
	"github.com/Bhushan9001/file_share_go/internal/routes"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {

	projectDir := ""

	err := godotenv.Load()

	if err != nil {
		log.Println("No .env file found , contunuing with default values!!")
	}

	if projectDir, err = os.Getwd(); err != nil {
		log.Printf("failed to get the working directory!!")
	}

	uploadsDir := filepath.Join(projectDir, "uploads")
	// buildDir := filepath.Join(projectDir, "build")

	if exists, err := directoryExistes(uploadsDir); err != nil {
		log.Printf("Error Checking directory:%v", err)
	} else if exists {

	} else {
		if err := os.Mkdir(uploadsDir, os.ModePerm); err != nil {
			log.Printf("Failed to create uploads directory")
		}
	}

	config.InitDB()
	defer config.CloseDB()

	router := gin.Default()

	router.Use(cors.Default())

	router.Static("/assets", "build/assets")
	router.Static("/files", uploadsDir)
	router.StaticFile("/", "build/index.html")
	router.NoRoute(func(c *gin.Context) {
		c.File("build/index.html")
	})

	router.Use(func(c *gin.Context) {
		if c.Request.URL.Path == "/assets/index-AMjjMP4s.css" {
			c.Header("Content-Type", "text/css")
		}
		c.Next()
	})

	routes.FileHandleRoutes(router)

	port := os.Getenv("PORT")

	if port == "" {
		port = "8080"
	}

	log.Printf("Starting the server!!")
	err = router.Run(":" + port)
	if err != nil {

		log.Printf("Error while starting the server!!")
	}

	log.Printf("[server]:=http://localhost:%v/", port)

}

func directoryExistes(path string) (bool, error) {

	info, err := os.Stat(path)

	if os.IsNotExist(err) {
		return false, nil
	}
	if err != nil {
		return false, err
	}

	return info.IsDir(), nil
}
