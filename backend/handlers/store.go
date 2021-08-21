package handlers

import (
	"context"
	"encoding/json"
	"fmt"
	"math"
	"net/http"
	"os"
	"time"

	"queue.bot/toldyouso-backend/db"

	"github.com/mailgun/mailgun-go/v4"
	"github.com/qbxt/gologger"
	"github.com/sirupsen/logrus"
	"github.com/speps/go-hashids"
)

type storeReturn struct {
	Location    string    `json:"location"`
	AvailableAt time.Time `json:"availableAt"`
}

const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_"

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

	incomingJson.SubmittedAt = time.Now().UTC()
	if len(incomingJson.Message) > 2000 {
		incomingJson.Message = incomingJson.Message[:2000]
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

	unsubscribeToken := ""

	mg := mailgun.NewMailgun(os.Getenv("TOLDYOUSO_SENDING_DOMAIN"), os.Getenv("TOLDYOUSO_MAILGUN_PRIVKEY"))

	sender := "i@told-you.so"
	subject := "Your told-you.so prediction"

	message := mg.NewMessage(sender, subject, "", incomingJson.Email)

	timeUntilRelease := ""
	timeUntilAsDuration := time.Until(incomingJson.AvailableAt)
	if timeUntilAsDuration.Hours() > 24 {
		timeUntilRelease = fmt.Sprintf("In %f days", math.Ceil(timeUntilAsDuration.Hours()/24))
	} else if timeUntilAsDuration.Hours() > 0 {
		timeUntilRelease = fmt.Sprintf("In %f hours", math.Ceil(timeUntilAsDuration.Hours()))
	} else if timeUntilAsDuration.Minutes() > 0 {
		timeUntilRelease = fmt.Sprintf("In %f minutes", math.Ceil(timeUntilAsDuration.Minutes()))
	} else if timeUntilAsDuration.Seconds() > 0 {
		timeUntilRelease = fmt.Sprintf("In %f seconds", math.Ceil(timeUntilAsDuration.Seconds()))
	} else {
		timeUntilRelease = "As of right now"
	}

	body := fmt.Sprintf(`
<html>
    <head>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Quicksand&display=swap');
            * {
                font-family: 'Quicksand', Arial, Helvetica, Ubuntu, sans-serif;
            }
        </style>
    </head>
    <body style="margin: 0; padding: 0">
        <div style="background-color: rgba(0,0,0,1); min-height: 100vh; min-width: 100vh; padding: 2rem;">
            <div style="font-weight: 700; color: transparent; background-clip: text; -webkit-background-clip: text; font-size: 3.75rem; background-image: linear-gradient(to bottom right, #c02d63, #7c3aed); text-align: center">
                Your prediction has been stored!
            </div>
            <div style="color: rgba(255,255,255,1); text-align: center; font-size: 1.5rem; line-height: 2rem; margin-top: 0.5rem;">
                In %s, everyone can see it at <a href="https://told-you.so/p/%s" style="text-decoration: underline; color: inherit">told-you.so/p/%s</a> 🔮
            </div>
            <div style="color: rgba(255,255,255,1); text-align: center; font-size: 1.25rem; line-height: 1.75rem; margin-top: 0.5rem;">
                A live countdown is available at your prediction's URL right now
            </div>
            <div style="margin-top: 3rem;"></div>
            <div style="display: flex; justify-content: center">
                <div style="color: rgba(156,163,175,1); max-width: 32rem; text-align: justify;">
                    If you want to stop receiving emails from us forever, <a href="https://told-you.so/unsubscribe?token=%s" style="text-decoration: underline; color: inherit">click here to unsubscribe</a> and be added to the email blacklist.
                    To resubscribe, send an email to <a href="mailto:toldyouso@queue.bot" style="text-decoration: underline; color: inherit">toldyouso@queue.bot</a>
                </div>
            </div>
            <div style="text-align: center; color: rgba(156,163,175,1); margin-top: 2rem;">
                <a href="https://told-you.so" style="color: transparent; background-clip: text; -webkit-background-clip: text; background-image: linear-gradient(to bottom right, #c02d63, #7c3aed);">told-you.so</a> by QueueBot
            </div>
        </div>
    </body>
</html>
`, timeUntilRelease, location, location)
	message.SetHtml(body)

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	_, _, err := mg.Send(ctx, message)
	if err != nil {
		gologger.Warn("could not send an email to a user", err, nil)
	}
}
