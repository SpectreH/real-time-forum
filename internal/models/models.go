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
	ID         int
	AuthorID   string
	Title      string
	Body       []string
	Created    string
	Comments   int
	Categories []string
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
	CreatedAt time.Time
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
