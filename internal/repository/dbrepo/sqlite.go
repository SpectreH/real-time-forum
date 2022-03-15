package dbrepo

import (
	"database/sql"
	"real-time-forum/internal/models"
	"real-time-forum/pkg/helpers"
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

// InsertPost inserts a new post into database
func (m *sqliteDBRepo) InsertPost(post models.Post) (int, error) {
	var postId int

	query := `insert into posts (author_id, title, body, created, comments) values ($1, $2, $3, $4, $5) returning id;`
	row := m.DB.QueryRow(query, &post.AuthorID, &post.Title, &post.Body, &post.Created, &post.Comments)
	err := row.Scan(&postId)

	if err != nil {
		return -1, err
	}

	return postId, nil
}

// InsertComment inserts a new comment into database
func (m *sqliteDBRepo) InsertComment(comment models.PostComment) error {
	query := `insert into post_comments (post_id, author_id, created, body) values ($1, $2, $3, $4);`
	_, err := m.DB.Exec(query, &comment.PostID, &comment.AuthorID, &comment.Created, &comment.Body)

	if err != nil {
		return err
	}

	err = m.UpdatePostCommentsCounter(comment.PostID)
	if err != nil {
		return err
	}

	return nil
}

// InsertPostCategory inserts all new post categories into database
func (m *sqliteDBRepo) InsertPostCategory(categories []string, postId int) error {
	for _, category := range categories {
		query := `INSERT INTO post_categories (post_id, category) VALUES ($1, (SELECT id FROM categories WHERE category = $2));`
		_, err := m.DB.Exec(query, &postId, &category)

		if err != nil {
			return err
		}
	}

	return nil
}

// InsertMessage inserts a new message from private chat into database
func (m *sqliteDBRepo) InsertMessage(message models.Message) error {
	query := `insert into messages (from_user_id, to_user_id, message, created) values ($1, $2, $3, $4);`
	_, err := m.DB.Exec(query, &message.FromUserID, &message.ToUserID, &message.Message, time.Now())

	if err != nil {
		return err
	}

	return nil
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
	_, err := m.DB.Exec(query, &token, &id)
	if err != nil {
		return err
	}

	return nil
}

// UpdatePostCommentsCounter updates comments counter of certain post with +1
func (m *sqliteDBRepo) UpdatePostCommentsCounter(postId int) error {
	var currentCounter int
	sqlStmt := "SELECT comments FROM posts WHERE id = $1"
	err := m.DB.QueryRow(sqlStmt, postId).Scan(&currentCounter)
	if err != nil {
		return err
	}

	currentCounter++
	sqlStmt = "update posts set comments = $1 where id = $2"
	_, err = m.DB.Exec(sqlStmt, currentCounter, postId)
	if err != nil {
		return err
	}

	return nil
}

// GetAllCategories get all existing categories for main and new post page
func (m *sqliteDBRepo) GetAllCategories() ([]string, error) {
	var result []string

	sqlStmt := "SELECT category FROM categories"
	rows, err := m.DB.Query(sqlStmt)
	if err != nil {
		return result, err
	}

	for rows.Next() {
		var category string

		err := rows.Scan(&category)
		if err != nil {
			return nil, err
		}

		result = append(result, category)
	}

	return result, nil
}

// GetPostCategories gets all categories of ceration post
func (m *sqliteDBRepo) GetPostCategories(postID int) ([]string, error) {
	var result []string

	sqlStmt := "SELECT c.category FROM post_categories AS pc LEFT JOIN categories AS c ON pc.category = c.id WHERE pc.post_id = $1;"
	rows, err := m.DB.Query(sqlStmt, postID)
	if err != nil {
		return result, err
	}

	for rows.Next() {
		var category string

		err := rows.Scan(&category)
		if err != nil {
			return nil, err
		}

		result = append(result, category)
	}

	return result, nil
}

// GetPostList gets all posts in certain category
func (m *sqliteDBRepo) GetPostList(category string) ([]models.Post, error) {
	result := []models.Post{}

	sqlStmt := `
	SELECT p.id, p.title, p.created, u.username, u.id 
	FROM post_categories AS pc 
	LEFT JOIN posts AS p ON pc.post_id = p.id 
	LEFT JOIN users AS u ON p.author_id = u.id 
	WHERE pc.category = (SELECT id FROM categories WHERE category = $1);`

	rows, err := m.DB.Query(sqlStmt, &category)
	if err != nil {
		return result, err
	}

	for rows.Next() {
		var post models.Post

		err := rows.Scan(&post.ID, &post.Title, &post.Created, &post.AuthorName, &post.AuthorID)
		if err != nil {
			return nil, err
		}

		post.Categories, err = m.GetPostCategories(post.ID)
		if err != nil {
			return nil, err
		}

		result = append(result, post)
	}

	return result, nil
}

// GetPost gets the certain post's full data
func (m *sqliteDBRepo) GetPost(postId int) (models.Post, error) {
	post := models.Post{}

	query := `SELECT p.id, p.title, p.body, p.created, p.comments, u.username, u.id FROM posts AS p LEFT JOIN users AS u on u.id = p.author_id WHERE p.id = $1;`
	row := m.DB.QueryRow(query, postId)
	err := row.Scan(&post.ID, &post.Title, &post.Body, &post.Created, &post.Comments, &post.AuthorName, &post.AuthorID)
	if err != nil {
		return post, err
	}

	post.Categories, err = m.GetPostCategories(postId)
	if err != nil {
		return post, err
	}

	post.Paragraphs, err = helpers.DivideBodyIntoParagraphs(post.Body)
	if err != nil {
		return post, err
	}

	return post, nil
}

// GetPostComments gets all comments of certain post
func (m *sqliteDBRepo) GetPostComments(postId int) ([]models.PostComment, error) {
	result := []models.PostComment{}

	sqlStmt := `SELECT pc.id, pc.post_id, pc.author_id, pc.created, pc.body FROM post_comments as pc WHERE pc.post_id = $1;`
	rows, err := m.DB.Query(sqlStmt, &postId)

	if err == sql.ErrNoRows {
		return result, nil
	}

	if err != nil {
		return result, err
	}

	for rows.Next() {
		var comment models.PostComment

		err := rows.Scan(&comment.ID, &comment.PostID, &comment.AuthorID, &comment.Created, &comment.Body)
		if err != nil {
			return nil, err
		}

		comment.Paragraphs, err = helpers.DivideBodyIntoParagraphs(comment.Body)
		if err != nil {
			return result, err
		}

		comment.AuthorName, err = m.GetUserName(comment.AuthorID)
		if err != nil {
			return result, err
		}

		result = append(result, comment)
	}

	return result, nil
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

// GetUserName gets user's username by id
func (m *sqliteDBRepo) GetUserName(id int) (string, error) {
	var res string

	query := `select username from users where id = $1`
	err := m.DB.QueryRow(query, &id).Scan(&res)
	if err != nil {
		return "", err
	}

	return res, nil
}

// GetUserList gets all users id and username
func (m *sqliteDBRepo) GetUserList() ([]models.Chatter, error) {
	res := []models.Chatter{}

	sqlStmt := `SELECT id, username FROM users ORDER BY username;`
	rows, err := m.DB.Query(sqlStmt)

	if err != nil {
		return res, err
	}

	for rows.Next() {
		var chatter models.Chatter

		err := rows.Scan(&chatter.ID, &chatter.UserName)
		if err != nil {
			return nil, err
		}

		res = append(res, chatter)
	}

	return res, nil
}

// GetMessages gets all maximum 10 messages per pag from private chat
func (m *sqliteDBRepo) GetMessages(firstUserId int, secondUserId int, page int) ([]models.Message, error) {
	res := []models.Message{}

	sqlStmt := `
	SELECT * FROM messages 
	WHERE (to_user_id = $1 and from_user_id = $2) OR (to_user_id = $2 and from_user_id = $1) 
	ORDER BY created DESC
	LIMIT 10
	OFFSET (10 * $3);
	`

	rows, err := m.DB.Query(sqlStmt, firstUserId, secondUserId, page)

	if err != nil {
		return res, err
	}

	for rows.Next() {
		var message models.Message

		err := rows.Scan(&message.ID, &message.FromUserID, &message.ToUserID, &message.Message, &message.Created)
		if err != nil {
			return nil, err
		}

		res = append(res, message)
	}

	return res, nil
}
