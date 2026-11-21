package main

import (
	"log"

	"ganigeorgiev.com/pocketbase/pocketbase"
	"github.com/jeffreyhugh/toldyouso/pocketbase/hooks"
)

func main() {
	app := pocketbase.New()

	app.OnRecordEnrich("messages").BindFunc(hooks.AddChecksum)

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}
