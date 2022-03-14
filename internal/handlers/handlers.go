package handlers

import (
	"database/sql"
	"net/http"
	"real-time-forum/internal/repository"
	"real-time-forum/internal/repository/dbrepo"
	"real-time-forum/internal/socket"
	"time"

	uuid "github.com/satori/go.uuid"
)

// Repository is the repository type (Repository pattern)
type Repository struct {
	DB repository.DatabaseRepo
	SR *socket.SocketReader
}

// SetNewRepo creates a new repository
func SetNewRepo(conn *sql.DB, sr *socket.SocketReader) *Repository {
	return &Repository{
		DB: dbrepo.SetSqliteRepo(conn),
		SR: sr,
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
func checkForCookies(r *http.Request, w http.ResponseWriter) int {
	c, err := r.Cookie("session_token")

	if err == nil {
		res, err := Repo.DB.CheckSessionExistence(c.Value)

		if res != 0 && err == nil {
			return res
		}

		c := http.Cookie{
			Name:   "session_token",
			MaxAge: -1}
		http.SetCookie(w, &c)

		return 0
	}

	return 0
}
