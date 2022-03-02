package dbrepo

import (
	"database/sql"
	"real-time-forum/internal/models"
	"time"
)

// InsertUser inserts a new user into database
func (m *sqliteDBRepo) InsertUser(user models.User) (int, error) {
	var userID int

	query := `insert into users (first_name, last_name, age, gender, username, email, password, date) values ($1, $2, $3, $4, $5, $6, $7, $8) returning id;`
	row := m.DB.QueryRow(query, &user.FirstName, &user.LastName, &user.Age, &user.Gender, &user.UserName, &user.Email, &user.Password, time.Now())
	err := row.Scan(&userID)

	if err != nil {
		return -1, err
	}

	return userID, nil
}

// CheckUsernameExistence checks if username is already taken
func (m *sqliteDBRepo) CheckUsernameExistence(username string) (int, error) {
	var id int

	query := `select id from users where username = $1`
	err := m.DB.QueryRow(query, &username).Scan(&id)

	if err == sql.ErrNoRows {
		return 0, nil
	}

	if err != nil {
		return 0, err
	}

	return id, nil
}

// CheckEmailExistence checks if email is already taken
func (m *sqliteDBRepo) CheckEmailExistence(email string) (int, error) {
	var id int

	query := `select id from users where email = $1`
	err := m.DB.QueryRow(query, &email).Scan(&id)

	if err == sql.ErrNoRows {
		return 0, nil
	}

	if err != nil {
		return 0, err
	}

	return id, nil
}

// CheckSessionExistence checks if session token exists in the database
func (m *sqliteDBRepo) CheckSessionExistence(token string) (int, error) {
	var id int

	query := `select id from users where session_token = $1`
	err := m.DB.QueryRow(query, &token).Scan(&id)

	if err == sql.ErrNoRows {
		return 0, nil
	}

	if err != nil {
		return 0, err
	}

	return id, nil
}

// UpdateSessionToken updates token to a new one for user
func (m *sqliteDBRepo) UpdateSessionToken(token string, id int) error {
	query := `update users set session_token = $1 where id = $2`
	err := m.DB.QueryRow(query, &token, &id).Err()
	if err != nil {
		return err
	}

	return nil
}

// GetUserHash gets user's password hash for further compare
func (m *sqliteDBRepo) GetUserHash(id int) (string, error) {
	var hash string

	query := `select password from users where id = $1`
	err := m.DB.QueryRow(query, &id).Scan(&hash)
	if err != nil {
		return "", err
	}

	return hash, nil
}
