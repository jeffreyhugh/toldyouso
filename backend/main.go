package main

import (
	"context"
	"fmt"
	"math/rand"
	"net/http"
	"os"
	"os/signal"
	"time"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"github.com/qbxt/gologger"
	"github.com/sirupsen/logrus"

	"queue.bot/toldyouso-backend/db"
	"queue.bot/toldyouso-backend/handlers"
	"queue.bot/toldyouso-backend/middleware"
)

func main() {
	gologger.Init(logrus.InfoLevel)

	if err := godotenv.Load("backend.env"); err != nil {
		gologger.Fatal("could not load env", err, nil)
	}

	if !db.Init() {
		gologger.Fatal("could not init db", nil, nil)
	}

	rand.Seed(time.Now().UnixNano())

	r := mux.NewRouter()

	r.Use(middleware.CorsMiddleware)
	r.HandleFunc("/v1/fetch", handlers.HandleFetch)
	r.HandleFunc("/v1/store", handlers.HandleStore)

	ip := "0.0.0.0"
	port := 443
	srv := &http.Server{
		Addr:    fmt.Sprintf("%s:%d", ip, port),
		Handler: r,
	}

	gologger.Info("server is running", logrus.Fields{"ip": ip, "port": port})
	go func() {
		if err := srv.ListenAndServeTLS("./certs/cert.pem", "./certs/key.pem"); err != nil {
			gologger.Error("server error", err, nil)
		}
	}()

	c := make(chan os.Signal, 1)
	signal.Notify(c, os.Interrupt)

	<-c

	ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
	defer cancel()

	_ = srv.Shutdown(ctx)

	gologger.Info("received interrupt, shutting down", nil)
	os.Exit(0)
}
