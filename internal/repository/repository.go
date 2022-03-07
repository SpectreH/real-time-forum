package repository

import "real-time-forum/internal/models"

// DatabaseRepo holds functions for database interaction
type DatabaseRepo interface {
	InsertUser(user models.User) (int, error)
	CheckUsernameExistence(username string) (int, error)
	CheckEmailExistence(email string) (int, error)
	CheckSessionExistence(token string) (int, error)
	UpdateSessionToken(token string, id int) error
	GetAllCategories() ([]string, error)
	GetUserHash(id int) (string, error)
}
