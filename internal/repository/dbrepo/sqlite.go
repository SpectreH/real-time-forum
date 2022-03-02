package dbrepo

import (
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
