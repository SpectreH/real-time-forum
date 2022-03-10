package handlers

import (
	"html/template"
	"log"
	"net/http"
	"real-time-forum/internal/models"
)

// Index is the handler for the index html page
func (m *Repository) Index(w http.ResponseWriter, r *http.Request) {
	t, err := template.ParseFiles("index.html")
	if err != nil {
		log.Fatal("Error executing template :", err)
		return
	}

	err = t.Execute(w, models.GlobalData)
	if err != nil {
		log.Fatal("Error executing template :", err)
		return
	}

	models.ClearGlobalData()
}
