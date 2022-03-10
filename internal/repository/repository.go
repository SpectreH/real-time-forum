package repository

import "real-time-forum/internal/models"

// DatabaseRepo holds functions for database interaction
type DatabaseRepo interface {
	InsertUser(user models.User) (int, error)
	InsertPost(post models.Post) (int, error)
	InsertPostCategory(categories []string, postId int) error
	CheckUsernameExistence(username string) (int, error)
	CheckEmailExistence(email string) (int, error)
	CheckSessionExistence(token string) (int, error)
	UpdateSessionToken(token string, id int) error
	GetAllCategories() ([]string, error)
	GetPostList(category string) ([]models.Post, error)
	GetPostCategories(postID int) ([]string, error)
	GetPost(postId int) (models.Post, error)
	GetUserHash(id int) (string, error)
}
