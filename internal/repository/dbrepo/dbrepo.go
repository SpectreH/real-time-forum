package dbrepo

import (
	"database/sql"
	"real-time-forum/internal/repository"
)

// sqliteDBRepo holds the database for sqlite
type sqliteDBRepo struct {
	DB *sql.DB
}

// SetSqliteRepo sets repository for sqlite
func SetSqliteRepo(conn *sql.DB) repository.DatabaseRepo {
	return &sqliteDBRepo{
		DB: conn,
	}
}
