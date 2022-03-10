package handlers

import (
	"database/sql"
	"net/http"
	"real-time-forum/internal/repository"
	"real-time-forum/internal/repository/dbrepo"
	"time"

	uuid "github.com/satori/go.uuid"
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

// Favicon is the handler for the favicon
func (m *Repository) Favicon(w http.ResponseWriter, r *http.Request) {

}

// createSessionToken creates token for cookies and database
func createSessionToken(w http.ResponseWriter) string {
	sessionToken := uuid.NewV4().String()

	http.SetCookie(w, &http.Cookie{
		Name:    "session_token",
		Value:   sessionToken,
		Expires: time.Now().Add(1200 * time.Second),
	})

	return sessionToken
}

// checkForCookies checks if cookies exists in the database
func checkForCookies(r *http.Request, w http.ResponseWriter) (int, bool) {
	c, err := r.Cookie("session_token")

	if err == nil {
		res, err := Repo.DB.CheckSessionExistence(c.Value)

		if res != 0 && err == nil {
			return res, true
		}

		c := http.Cookie{
			Name:   "session_token",
			MaxAge: -1}
		http.SetCookie(w, &c)

		return 0, false
	}

	return 0, false
}
