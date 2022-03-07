package models

import "time"

// User is the user model
type User struct {
	ID           int
	FirstName    string
	LastName     string
	Age          int
	Gender       string
	UserName     string
	Email        string
	Password     string
	SessionToken string
	CreatedAt    time.Time
}

// Post is the post model
type Post struct {
	ID           int           `json:"id"`
	AuthorID     int           `json:"authorId"`
	AuthorName   string        `json:"authorName"`
	Title        string        `json:"title"`
	Body         string        `json:"body"`
	Created      string        `json:"created"`
	Comments     int           `json:"comments"`
	Categories   []string      `json:"categories"`
	PostComments []PostComment `json:"postComments"`
}

// Category is the post category model
type Category struct {
	ID   int
	Name string
}

// PostComment is the post comment model
type PostComment struct {
	ID        int
	PostID    int
	AuthorID  int
	Body      []string
	CreatedAt string
}

// PostCategory is the post category model
type PostCategory struct {
	ID         int
	PostID     int
	CategoryID int
}

type JsonResponse struct {
	OK      bool     `json:"ok"`
	Message string   `json:"message"`
	Data    []string `json:"data"`
}
