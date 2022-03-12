package routes

import (
	"net/http"
	"real-time-forum/internal/handlers"
)

// SetRoutes sets handler and load server files
func SetRoutes() http.Handler {
	mux := http.NewServeMux()

	mux.HandleFunc("/", handlers.Repo.Index)
	mux.HandleFunc("/favicon.ico", handlers.Repo.Favicon)

	mux.HandleFunc("/registration-post", handlers.Repo.PostRegister)
	mux.HandleFunc("/login-post", handlers.Repo.PostLogin)

	mux.HandleFunc("/categories-post", handlers.Repo.PostCategories)
	mux.HandleFunc("/new-post", handlers.Repo.NewPost)
	mux.HandleFunc("/new-comment", handlers.Repo.NewComment)
	mux.HandleFunc("/get-post-list", handlers.Repo.GetPostList)
	mux.HandleFunc("/get-post", handlers.Repo.GetPost)

	mux.HandleFunc("/cookie-validation", handlers.Repo.PostCookieValidation)
	mux.HandleFunc("/logout", handlers.Repo.Logout)

	fs := http.FileServer(http.Dir("static"))
	mux.Handle("/static/", http.StripPrefix("/static/", fs))

	return mux
}
