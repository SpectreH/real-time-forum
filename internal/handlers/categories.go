package handlers

import (
	"encoding/json"
	"log"
	"net/http"
	"real-time-forum/internal/models"
)

// PostCategories is the handler for the fetching all categories from database
func (m *Repository) PostCategories(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {
		categories, err := m.DB.GetAllCategories()
		if err != nil {
			log.Println(err)

			resp := models.JsonResponse{
				OK: false,
			}

			out, _ := json.MarshalIndent(resp, "", "    ")

			w.Header().Set("Content-Type", "application/json")
			w.Write(out)

			return
		}

		resp := models.JsonResponse{
			OK:   true,
			Data: categories,
		}

		out, _ := json.MarshalIndent(resp, "", "    ")

		w.Header().Set("Content-Type", "application/json")
		w.Write(out)
	}
}
