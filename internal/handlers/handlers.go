package handlers

// Repository is the repository type (Repository pattern)
type Repository struct {
}

// SetNewRepo creates a new repository
func SetNewRepo() *Repository {
	return &Repository{}
}

// Repo is the repository used by the handlers
var Repo *Repository

// SetNewHandlers sets the repository for the handlers
func SetNewHandlers(r *Repository) {
	Repo = r
}
