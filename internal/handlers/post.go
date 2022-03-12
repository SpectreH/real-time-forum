package handlers

import (
	"encoding/base64"
	"encoding/json"
	"log"
	"net/http"
	"real-time-forum/internal/models"
	"strconv"
	"time"
)

// GetPost is the handler for getting certain post
func (m *Repository) GetPost(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {
		postId, err := strconv.Atoi(r.FormValue("postId"))
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

		post, err := m.DB.GetPost(postId)
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

		post.PostComments, err = m.DB.GetPostComments(postId)
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

		out, _ := json.MarshalIndent(post, "", "    ")
		w.Header().Set("Content-Type", "application/json")
		w.Write(out)
		return
	}

	http.Redirect(w, r, "/", http.StatusFound)
}

// GetPostList is the handler for getting all posts
func (m *Repository) GetPostList(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {
		category := r.FormValue("category")

		postList, err := m.DB.GetPostList(category)
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

		out, _ := json.MarshalIndent(postList, "", "    ")
		w.Header().Set("Content-Type", "application/json")
		w.Write(out)
		return
	}

	http.Redirect(w, r, "/", http.StatusFound)
}

// NewPost is the handler for saving new comment
func (m *Repository) NewComment(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {
		authorId := checkForCookies(r, w)
		if authorId == 0 {
			models.GlobalData.Error = "You must be logged in to post a comment!"
			http.Redirect(w, r, "/login", http.StatusFound)
			return
		}

		postId, err := strconv.Atoi(r.FormValue("postId"))
		if err != nil {
			models.GlobalData.Error = "Error with parsing post id"
			http.Redirect(w, r, "/", http.StatusFound)
			return
		}

		newComment := models.PostComment{
			AuthorID: authorId,
			PostID:   postId,
			Body:     base64.StdEncoding.EncodeToString([]byte(r.FormValue("comment"))),
			Created:  time.Now().Local(),
		}

		err = m.DB.InsertComment(newComment)
		if err != nil {
			models.GlobalData.Error = "Error with inserting new comment into database"
			http.Redirect(w, r, "/", http.StatusFound)
			return
		}

		models.GlobalData.Flash = "Your comment has been successfully submitted!"
		http.Redirect(w, r, r.Header.Get("Referer"), http.StatusFound)
		return
	}

	http.Redirect(w, r, "/", http.StatusFound)
}

// NewPost is the handler for saving new post
func (m *Repository) NewPost(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {
		err := r.ParseForm()
		if err != nil {
			log.Println(err)
			http.Redirect(w, r, "/new", http.StatusFound)
			return
		}

		userId := checkForCookies(r, w)
		if userId == 0 {
			http.Redirect(w, r, "/new", http.StatusFound)
			return
		}

		postCategories := r.Form["category"]

		newPost := models.Post{
			AuthorID: userId,
			Title:    r.FormValue("title"),
			Body:     base64.StdEncoding.EncodeToString([]byte(r.FormValue("new-content"))),
			Created:  time.Now().Local(),
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

		models.GlobalData.Flash = "New post successfully created!"
	}

	http.Redirect(w, r, "/", http.StatusFound)
}
