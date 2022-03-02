package handlers

import (
	"log"
	"net/http"
	"real-time-forum/internal/models"
	"strconv"

	"golang.org/x/crypto/bcrypt"
)

// PostRegister is the handler for registration a new user
func (m *Repository) PostRegister(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {

		user := models.User{}

		user.UserName = r.FormValue("username")
		user.Email = r.FormValue("email")
		user.FirstName = r.FormValue("firstName")
		user.LastName = r.FormValue("lastName")
		user.Age, _ = strconv.Atoi(r.FormValue("age"))
		user.Gender = r.FormValue("gender")
		user.Password = getHash([]byte(r.FormValue("password")))

		res, err := m.DB.CheckUsernameExistence(user.UserName)
		if res != 0 || err != nil {
			log.Println(err)
			http.Redirect(w, r, "/registration", http.StatusFound)
			return
		}

		res, err = m.DB.CheckEmailExistence(user.Email)
		if res != 0 || err != nil {
			log.Println(err)
			http.Redirect(w, r, "/registration", http.StatusFound)
			return
		}

		user.SessionToken = createSessionToken(w)

		_, err = m.DB.InsertUser(user)
		if err != nil {
			log.Println(err)
			http.Redirect(w, r, "/registration", http.StatusFound)
			return
		}
	}

	http.Redirect(w, r, "/", http.StatusFound)
}

// getHash generates hash from password
func getHash(pwd []byte) string {
	hash, err := bcrypt.GenerateFromPassword(pwd, bcrypt.MinCost)
	if err != nil {
		log.Println(err)
	}
	return string(hash)
}
