package db

import (
	"os"
	"time"

	"github.com/qbxt/gologger"
	"github.com/sirupsen/logrus"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DB *gorm.DB = nil

func Init() bool {
	dsn := os.Getenv("DB_DSN")
	for i := 0; i < 10; i++ {
		db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
		if err == nil {
			DB = db
			return true
		}
		gologger.Error("could not connect to DB", err, logrus.Fields{
			"attempts": i,
		})
		time.Sleep(3 * time.Second)
	}
	gologger.Error("could not connect to DB after 10 tries", nil, nil)
	return false
}