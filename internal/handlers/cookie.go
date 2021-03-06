package handlers

import (
	"encoding/json"
	"net/http"
	"real-time-forum/internal/models"
)

// PostCookieValidation is the handler for cookie validation
func (m *Repository) PostCookieValidation(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {
		id := checkForCookies(r, w)

		var res bool = false
		if id != 0 {
			res = true
		}

		resp := models.JsonResponse{
			OK: res,
		}

		out, _ := json.MarshalIndent(resp, "", "    ")

		w.Header().Set("Content-Type", "application/json")
		w.Write(out)
	}
}
