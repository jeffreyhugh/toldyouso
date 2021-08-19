package handlers

import (
	"encoding/json"
	"net/http"
	"os"
	"time"

	"queue.bot/toldyouso-backend/db"

	"github.com/qbxt/gologger"
	"github.com/sirupsen/logrus"
	"github.com/speps/go-hashids"
)

type storeReturn struct {
	Location    string    `json:"location"`
	AvailableAt time.Time `json:"availableAt"`
}

func HandleStore(w http.ResponseWriter, r *http.Request) {
	incomingJson := &db.Row{}
	if err := json.NewDecoder(r.Body).Decode(incomingJson); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(map[string]interface{}{
			"code":    http.StatusBadRequest,
			"message": "bad json request",
			"ok":      false,
		})
		return
	}

	if err := db.DB.Table("toldyouso").Create(incomingJson).Error; err != nil {
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

	gologger.Info("stored a message", logrus.Fields{
		"requester": r.RemoteAddr,
	})

	_ = json.NewEncoder(w).Encode(ret_)
}
