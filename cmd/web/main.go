package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"real-time-forum/internal/handlers"
	"real-time-forum/internal/routes"

	_ "github.com/mattn/go-sqlite3"
)

func main() {
	database, _ := sql.Open("sqlite3", "./database/forum.db")
	defer database.Close()

	handlersRepo := handlers.SetNewRepo(database)
	handlers.SetNewHandlers(handlersRepo)

	srv := &http.Server{
		Addr:    ":8080",
		Handler: routes.SetRoutes(),
	}

	fmt.Println("Starting application on port " + srv.Addr)
	if srv.ListenAndServe() != nil {
		log.Fatalf("%v - Internal Server Error", http.StatusInternalServerError)
	}
}
