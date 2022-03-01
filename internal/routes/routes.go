package routes

import (
	"net/http"
	"real-time-forum/internal/handlers"
)

// SetRoutes sets handler and load server files
func SetRoutes() http.Handler {
	mux := http.NewServeMux()

	mux.HandleFunc("/", handlers.Repo.Index)

	fs := http.FileServer(http.Dir("./static"))
	mux.Handle("/static/", http.StripPrefix("/static/", fs))

	return mux
}
