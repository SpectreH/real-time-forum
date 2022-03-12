package handlers

import (
	"log"
	"net/http"
	"real-time-forum/internal/models"

	"golang.org/x/crypto/bcrypt"
)

// PostLogin is the handler for authentication
func (m *Repository) PostLogin(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {
		login := r.FormValue("login")
		password := []byte(r.FormValue("password"))

		id, err := m.DB.CheckUsernameExistence(login)
		if err != nil {
			log.Println(err)
			http.Redirect(w, r, "/login", http.StatusFound)
			return
		}

		if id == 0 {
			id, err = m.DB.CheckEmailExistence(login)

			if err != nil {
				log.Println(err)
				http.Redirect(w, r, "/login", http.StatusFound)
				return
			}
		}

		if id != 0 {
			hash, err := m.DB.GetUserHash(id)
			if err != nil {
				log.Println(err)
				http.Redirect(w, r, "/login", http.StatusFound)
				return
			}

			if bcrypt.CompareHashAndPassword([]byte(hash), password) == nil {
				err := m.DB.UpdateSessionToken(createSessionToken(w), id)
				if err != nil {
					http.Redirect(w, r, "/login", http.StatusFound)
					return
				}
				models.GlobalData.Flash = "You successfully logged in!"
			} else {
				models.GlobalData.Error = "Invalid password!"
				http.Redirect(w, r, "/login", http.StatusFound)
				return
			}

		} else {
			models.GlobalData.Error = "This username/email is not registered!"
			http.Redirect(w, r, "/login", http.StatusFound)
			return
		}
	}

	http.Redirect(w, r, "/", http.StatusFound)
}

// Logout is the handler for logging out
func (m *Repository) Logout(w http.ResponseWriter, r *http.Request) {
	id := checkForCookies(r, w)

	if id != 0 {
		c := http.Cookie{
			Name:   "session_token",
			MaxAge: -1}
		http.SetCookie(w, &c)

		models.GlobalData.Flash = "You successfully logged out!"
		http.Redirect(w, r, "/login", http.StatusFound)
		return
	}

	http.Redirect(w, r, "/", http.StatusFound)
}
