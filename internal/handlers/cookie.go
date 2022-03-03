package handlers

import (
	"encoding/json"
	"net/http"
)

type jsonResponse struct {
	OK      bool   `json:"ok"`
	Message string `json:"message"`
	Data    string `json:"data"`
}

// PostCookieValidation is the handler for cookie validation
func (m *Repository) PostCookieValidation(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {
		res := checkForCookies(r, w)

		resp := jsonResponse{
			OK: res,
		}

		out, _ := json.MarshalIndent(resp, "", "    ")

		w.Header().Set("Content-Type", "application/json")
		w.Write(out)
	}
}
