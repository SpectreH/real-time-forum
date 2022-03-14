package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"real-time-forum/internal/handlers"
	"real-time-forum/internal/routes"
	"real-time-forum/internal/socket"

	_ "github.com/mattn/go-sqlite3"
)

func main() {
	database, _ := sql.Open("sqlite3", "./database/forum.db")
	defer database.Close()

	socketReader := socket.SetSocketReader(database)
	handlersRepo := handlers.SetNewRepo(database, socketReader)
	handlers.SetNewHandlers(handlersRepo)

	srv := &http.Server{
		Addr:    ":9000",
		Handler: routes.SetRoutes(),
	}

	fmt.Println("Starting application on port " + srv.Addr)
	if srv.ListenAndServe() != nil {
		log.Fatalf("%v - Internal Server Error", http.StatusInternalServerError)
	}
}
