package handlers

import (
	"encoding/json"
	"log"
	"net/http"
	"real-time-forum/internal/models"
	"strconv"
)

// GetChat is the handler for getting certain messages from private chat
func (m *Repository) GetChat(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {
		firstUserId := checkForCookies(r, w)

		secondUserId, err := strconv.Atoi(r.FormValue("secondUserId"))
		if err != nil {
			log.Println(err)
			resp := models.JsonResponse{OK: false}
			out, _ := json.MarshalIndent(resp, "", "    ")
			w.Header().Set("Content-Type", "application/json")
			w.Write(out)
			return
		}

		page, err := strconv.Atoi(r.FormValue("page"))
		if err != nil {
			log.Println(err)
			resp := models.JsonResponse{OK: false}
			out, _ := json.MarshalIndent(resp, "", "    ")
			w.Header().Set("Content-Type", "application/json")
			w.Write(out)
			return
		}

		offset, err := strconv.Atoi(r.FormValue("offset"))
		if err != nil {
			log.Println(err)
			resp := models.JsonResponse{OK: false}
			out, _ := json.MarshalIndent(resp, "", "    ")
			w.Header().Set("Content-Type", "application/json")
			w.Write(out)
			return
		}

		messages, err := m.DB.GetMessages(firstUserId, secondUserId, page, offset)
		if err != nil {
			log.Println(err)
			resp := models.JsonResponse{OK: false}
			out, _ := json.MarshalIndent(resp, "", "    ")
			w.Header().Set("Content-Type", "application/json")
			w.Write(out)
			return
		}

		out, _ := json.MarshalIndent(messages, "", "    ")
		w.Header().Set("Content-Type", "application/json")
		w.Write(out)
		return
	}
}
