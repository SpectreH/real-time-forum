package handlers

import (
	"database/sql"
	"real-time-forum/internal/repository"
	"real-time-forum/internal/repository/dbrepo"
)

// Repository is the repository type (Repository pattern)
type Repository struct {
	DB repository.DatabaseRepo
}

// SetNewRepo creates a new repository
func SetNewRepo(conn *sql.DB) *Repository {
	return &Repository{
		DB: dbrepo.SetSqliteRepo(conn),
	}
}

// Repo is the repository used by the handlers
var Repo *Repository

// SetNewHandlers sets the repository for the handlers
func SetNewHandlers(r *Repository) {
	Repo = r
}
