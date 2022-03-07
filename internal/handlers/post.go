package handlers

import (
	"encoding/base64"
	"log"
	"net/http"
	"real-time-forum/internal/models"
	"time"
)

// NewPost is the handler for saving new post
func (m *Repository) NewPost(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {
		err := r.ParseForm()
		if err != nil {
			log.Println(err)
			http.Redirect(w, r, "/new", http.StatusFound)
			return
		}

		userId, res := checkForCookies(r, w)
		if !res {
			http.Redirect(w, r, "/new", http.StatusFound)
			return
		}

		postCategories := r.Form["category"]

		newPost := models.Post{
			AuthorID: userId,
			Title:    r.FormValue("title"),
			Body:     base64.StdEncoding.EncodeToString([]byte(r.FormValue("new-content"))),
			Created:  time.Now().Local().Format(time.RFC1123),
			Comments: 0,
		}

		postId, err := m.DB.InsertPost(newPost)
		if err != nil {
			log.Println(err)
			http.Redirect(w, r, "/new", http.StatusFound)
			return
		}

		err = m.DB.InsertPostCategory(postCategories, postId)
		if err != nil {
			log.Println(err)
			http.Redirect(w, r, "/new", http.StatusFound)
			return
		}
	}

	http.Redirect(w, r, "/", http.StatusFound)
}
