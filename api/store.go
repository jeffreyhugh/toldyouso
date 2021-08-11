package handler

import (
	"encoding/json"
	"net/http"
	"os"
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"

	"github.com/speps/go-hashids"
)

type storeRow struct {
	ID          int64     `json:"-" gorm:"column:id"`
	Email       string    `json:"email" gorm:"column:email"`
	Message     string    `json:"message" gorm:"column:message"`
	AvailableAt time.Time `json:"availableAt" gorm:"column:available_at"`
	Encrypted   bool      `json:"encrypted" gorm:"column:encrypted"`
}

type storeReturn struct {
	Location    string    `json:"location"`
	AvailableAt time.Time `json:"availableAt"`
}

func Store(w http.ResponseWriter, r *http.Request) {
	incomingJson := &storeRow{}
	if err := json.NewDecoder(r.Body).Decode(incomingJson); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(map[string]interface{}{
			"code":    http.StatusBadRequest,
			"message": "bad json request",
			"ok":      false,
		})
		return
	}

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

	if err := db.Table("toldyouso").Create(incomingJson).Error; err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		_ = json.NewEncoder(w).Encode(map[string]interface{}{
			"code":    http.StatusInternalServerError,
			"message": "could not insert row",
			"ok":      false,
		})
		return
	}

	hd := hashids.NewData()
	hd.Salt = os.Getenv("SALT")
	hd.MinLength = 6
	h, _ := hashids.NewWithData(hd)
	location, _ := h.EncodeInt64([]int64{incomingJson.ID})

	ret_ := &storeReturn{
		Location:    location,
		AvailableAt: incomingJson.AvailableAt,
	}

	_ = json.NewEncoder(w).Encode(ret_)
}
