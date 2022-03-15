package models

import (
	"time"
)

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

// Chatter is the model of user from chat list
type Chatter struct {
	Type     string `json:"type"`
	ID       int    `json:"id"`
	UserName string `json:"username"`
	Online   bool   `json:"online"`
	Myself   bool   `json:"myself"`
}

// Post is the post model
type Post struct {
	ID           int           `json:"id"`
	AuthorID     int           `json:"authorId"`
	AuthorName   string        `json:"authorName"`
	Title        string        `json:"title"`
	Body         string        `json:"body"`
	Paragraphs   []string      `json:"paragraphs"`
	Created      time.Time     `json:"created"`
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
	ID         int       `json:"id"`
	PostID     int       `json:"postId"`
	AuthorID   int       `json:"authorId"`
	AuthorName string    `json:"authorName"`
	Body       string    `json:"body"`
	Paragraphs []string  `json:"paragraphs"`
	Created    time.Time `json:"created"`
}

// PostCategory is the post category model
type PostCategory struct {
	ID         int
	PostID     int
	CategoryID int
}

type Message struct {
	Type       string    `json:"type"`
	ID         int       `json:"id"`
	FromUserID int       `json:"fromUserId"`
	ToUserID   int       `json:"toUserId"`
	Message    string    `json:"message"`
	Created    time.Time `json:"created"`
}

type JsonResponse struct {
	OK      bool     `json:"ok"`
	Message string   `json:"message"`
	Data    []string `json:"data"`
}
