package repository

import "real-time-forum/internal/models"

// DatabaseRepo holds functions for database interaction
type DatabaseRepo interface {
	InsertUser(user models.User) (int, error)
}
