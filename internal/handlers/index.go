package handlers

import (
	"net/http"
)

// Index is the handler for the index html page
func (m *Repository) Index(w http.ResponseWriter, r *http.Request) {
	// for i, route := range possibleRoutes {
	// 	if r.URL.Path == route {
	// 		break
	// 	}

	// 	if i == len(possibleRoutes)-1 {
	// 		http.NotFound(w, r)
	// 		return
	// 	}
	// }

	http.ServeFile(w, r, "index.html")
}
