package routes

import (
	"net/http"

	"github.com/Bhushan9001/file_share_go/internal/controllers"
	"github.com/gin-gonic/gin"
)

func FileHandleRoutes(r *gin.Engine) {

	r.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "I am running.."})
	})

	r.POST("/upload", controllers.UploadFIle)
	r.GET("/download/:id", controllers.DownloadFile)

}
