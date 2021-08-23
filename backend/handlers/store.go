package handlers

import (
	"context"
	"encoding/json"
	"fmt"
	"math"
	"math/rand"
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

var letters = []rune("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_")

func randSeq(n int) string {
	b := make([]rune, n)
	for i := range b {
		b[i] = letters[rand.Intn(len(letters))]
	}
	return string(b)
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

	unsubRow := &db.UnsubscribeRow{
		Email: incomingJson.Email,
		Token: randSeq(64),
		Valid: true,
	}

	if err := db.DB.Table("unsubscribe_tokens").Create(unsubRow).Error; err != nil {
		gologger.Warn("could not write unsub token to db", err, nil)
		return
	}

	mg := mailgun.NewMailgun(os.Getenv("TOLDYOUSO_SENDING_DOMAIN"), os.Getenv("TOLDYOUSO_MAILGUN_PRIVKEY"))

	sender := "i@told-you.so"
	subject := fmt.Sprintf("told-you.so message %s", location)

	message := mg.NewMessage(sender, subject, "", incomingJson.Email)

	timeUntilRelease := ""
	timeUntilAsDuration := time.Until(incomingJson.AvailableAt)
	if math.Round(timeUntilAsDuration.Hours()) > 24 {
		timeUntilRelease = fmt.Sprintf("In %d day", int(math.Round(timeUntilAsDuration.Hours()/24)))
		if math.Round(timeUntilAsDuration.Hours()/24) != 1 {
			timeUntilRelease += "s"
		}
	} else if math.Round(timeUntilAsDuration.Hours()) > 0 {
		timeUntilRelease = fmt.Sprintf("In %d hour", int(math.Round(timeUntilAsDuration.Hours())))
		if math.Round(timeUntilAsDuration.Hours()) != 1 {
			timeUntilRelease += "s"
		}
	} else if math.Round(timeUntilAsDuration.Minutes()) > 0 {
		timeUntilRelease = fmt.Sprintf("In %d minute", int(math.Round(timeUntilAsDuration.Minutes())))
		if math.Round(timeUntilAsDuration.Minutes()) != 1 {
			timeUntilRelease += "s"
		}
	} else if math.Round(timeUntilAsDuration.Seconds()) > 0 {
		timeUntilRelease = fmt.Sprintf("In %d second", int(math.Round(timeUntilAsDuration.Seconds())))
		if math.Round(timeUntilAsDuration.Seconds()) != 1 {
			timeUntilRelease += "s"
		}
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
            <div style="font-weight: 700; color: #7c3aed; font-size: 3.75rem; text-align: center">
                Your message has been stored!
            </div>
            <div style="color: rgba(255,255,255,1); text-align: center; font-size: 1.5rem; line-height: 2rem; margin-top: 0.5rem;">
                %s, everyone can see it at <a href="https://told-you.so/p/%s" style="text-decoration: underline; color: inherit">told-you.so/p/%s</a> 🔮
            </div>
            <div style="color: rgba(255,255,255,1); text-align: center; font-size: 1.25rem; line-height: 1.75rem; margin-top: 0.5rem;">
                A live countdown is available at your message's URL right now
            </div>
            <div style="margin-top: 3rem;"></div>
            <div style="width: 24rem; margin-left: auto; margin-right: auto;">
                <div style="color: rgba(156,163,175,1); text-align: justify;">
                    If you want to stop receiving emails from us forever, <a href="https://told-you.so/unsubscribe?token=%s" style="text-decoration: underline; color: inherit">click here to unsubscribe</a> and be added to the email blacklist.
                    To resubscribe, send an email to <a href="mailto:toldyouso@queue.bot" style="text-decoration: underline; color: inherit">toldyouso@queue.bot</a>
                </div>
            </div>
            <div style="text-align: center; color: rgba(156,163,175,1); margin-top: 2rem;">
                <a href="https://told-you.so" style="color: #7c3aed;">told-you.so</a> by QueueBot
            </div>
        </div>
    </body>
</html>
`, timeUntilRelease, location, location, unsubRow.Token)
	message.SetHtml(body)

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	_, _, err := mg.Send(ctx, message)
	if err != nil {
		gologger.Warn("could not send an email to a user", err, nil)
	}
}
