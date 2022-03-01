package main

import (
	"fmt"
	"log"
	"net/http"
	"real-time-forum/internal/routes"
)

func main() {
	srv := &http.Server{
		Addr:    ":8080",
		Handler: routes.SetRoutes(),
	}

	fmt.Println("Starting application on port " + srv.Addr)
	if srv.ListenAndServe() != nil {
		log.Fatalf("%v - Internal Server Error", http.StatusInternalServerError)
	}
}
