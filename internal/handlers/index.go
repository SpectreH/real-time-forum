package handlers

import "net/http"

// Index is the handler for the index html page
func (m *Repository) Index(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, "index.html")
}
