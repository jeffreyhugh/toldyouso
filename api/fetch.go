package handler

import (
	"encoding/json"
	"net/http"
	"os"
	"time"

	"github.com/speps/go-hashids"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type fetchRow struct {
	ID          int64     `json:"-" gorm:"column:id"`
	Email       string    `json:"email" gorm:"column:email"`
	Message     string    `json:"message" gorm:"column:message"`
	AvailableAt time.Time `json:"availableAt" gorm:"column:available_at"`
	Encrypted   bool      `json:"encrypted" gorm:"column:encrypted"`
}

type fetchReturn struct {
	AvailableAt time.Time `json:"availableAt"`
	Encrypted   bool      `json:"encrypted"`
	Message     string    `json:"message"`
}

func Fetch(w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query()
	postIDs := query["id"]
	postIDString := ""
	if len(postIDs) > 0 {
		postIDString = postIDs[0]
	}

	hd := hashids.NewData()
	hd.Salt = os.Getenv("SALT")
	hd.MinLength = 6
	h, _ := hashids.NewWithData(hd)
	id, _ := h.DecodeInt64WithError(postIDString)

	dsn := os.Getenv("DB_DSN")
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		_ = json.NewEncoder(w).Encode(map[string]interface{}{
			"code":    http.StatusInternalServerError,
			"message": "could not connect to db",
			"ok":      false,
		})
		return
	}

	data := &fetchRow{}
	if err := db.Raw("SELECT * FROM toldyouso WHERE id = ?", id[0]).Scan(data).Error; err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		_ = json.NewEncoder(w).Encode(map[string]interface{}{
			"code":    http.StatusInternalServerError,
			"message": "could not read from db",
			"ok":      false,
		})
		return
	}

	ret_ := &fetchReturn{
		AvailableAt: data.AvailableAt,
		Encrypted:   data.Encrypted,
		Message:     "",
	}

	if time.Now().After(data.AvailableAt) {
		ret_.Message = data.Message
	}

	_ = json.NewEncoder(w).Encode(ret_)
}
