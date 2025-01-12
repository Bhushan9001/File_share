package controllers

import (
	"crypto/md5"
	"encoding/hex"
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"

	"github.com/Bhushan9001/file_share_go/config"
	"github.com/gin-gonic/gin"
)

type FileData struct {
	id        string
	file_path string
	password  string
}

func UploadFIle(c *gin.Context) {

	var fm FileData
	file, err := c.FormFile("file")
	password := c.PostForm("password")

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "No file is uploaded", "error": err})
		return
	}

	projectDir, err := os.Getwd()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to get project directory", "err": err})
		return
	}

	destination := filepath.Join(projectDir, "uploads")

	dst := filepath.Join(destination, file.Filename)

	if err := c.SaveUploadedFile(file, dst); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to save the file", "error": err})
		return
	}

	hash := md5.Sum([]byte(file.Filename + password))
	fm.id = hex.EncodeToString(hash[:])
	fm.file_path = file.Filename
	fm.password = password
	// fileurl := fmt.Sprintf("http://localhost:8080/download/%s", fm.id)

	query := "INSERT INTO file_metadata(id,file_path,password)values(?,?,?);"
	_, err = config.DB.Exec(query, fm.id, fm.file_path, fm.password)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Failed to add file data",
			"error":   err,
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "File Uploaded successfully!!",
		"id":      fm.id,
	})

}

func DownloadFile(c *gin.Context) {

	fileId := c.Param("id")
	password := c.Query("password")

	var fm FileData

	projectDir, err := os.Getwd()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to get project directory", "err": err})
		return
	}

	destination := filepath.Join(projectDir, "uploads")

	query := `select * from file_metadata where id = ?`

	row := config.DB.QueryRow(query, fileId)
	log.Print(row)
	err = row.Scan(&fm.id, &fm.file_path, &fm.password)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Unable to find the file in database",
			"error":   err,
		})
		return
	}

	if fm.password != password {
		c.JSON(http.StatusUnauthorized, gin.H{
			"message": "Incorrect password",
		})
		return
	}

	fullPath := filepath.Join(destination, fm.file_path)
	log.Print(fullPath)

	if _, err := os.Stat(fullPath); os.IsNotExist(err) {
		c.JSON(http.StatusNotFound, gin.H{
			"message": "File not found on the server",
		})
		return
	}
	log.Print(fm.file_path)
	c.Header("Content-Disposition", fmt.Sprintf(`attachment; filename="%s"`, fm.file_path))
	c.Header("Content-Type", "application/octet-stream")
	c.Header("Access-Control-Expose-Headers", "Content-Disposition")
	c.File(fullPath)
}
