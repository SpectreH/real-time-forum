package handlers

import (
	"encoding/base64"
	"net/http"
	"real-time-forum/internal/models"
)

// NewPost is the handler for saving new post
func (m *Repository) NewPost(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {
		postCategories := r.Form["category"]

		newPost := &models.Post{
			Title: r.FormValue("title"),
			Body:  base64.StdEncoding.EncodeToString([]byte(r.FormValue("new-content"))),
		}

	}

	http.Redirect(w, r, "/", http.StatusFound)
}
