package handlers

import (
	"encoding/json"
	"net/http"
	"os"
	"time"

	"github.com/speps/go-hashids"

	"queue.bot/toldyouso-backend/db"
)

type fetchReturn struct {
	AvailableAt time.Time `json:"availableAt"`
	Encrypted   bool      `json:"encrypted"`
	Message     string    `json:"message"`
}

func HandleFetch(w http.ResponseWriter, r *http.Request) {
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

	data := &db.Row{}
	if err := db.DB.Raw("SELECT * FROM toldyouso WHERE id = ?", id[0]).Scan(data).Error; err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		_ = json.NewEncoder(w).Encode(map[string]interface{}{
			"code":          http.StatusInternalServerError,
			"error_message": "could not read from db",
			"ok":            false,
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
