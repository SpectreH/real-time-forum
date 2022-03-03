package handlers

import (
	"log"
	"net/http"

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
			} else {
				http.Redirect(w, r, "/login", http.StatusFound)
				return
			}

		} else {
			http.Redirect(w, r, "/login", http.StatusFound)
			return
		}
	}

	http.Redirect(w, r, "/", http.StatusFound)
}
