package repository

import "real-time-forum/internal/models"

// DatabaseRepo holds functions for database interaction
type DatabaseRepo interface {
	InsertUser(user models.User) (int, error)
	InsertPost(post models.Post) (int, error)
	InsertComment(comment models.PostComment) error
	InsertPostCategory(categories []string, postId int) error
	InsertMessage(message models.Message) error
	CheckUsernameExistence(username string) (int, error)
	CheckEmailExistence(email string) (int, error)
	CheckSessionExistence(token string) (int, error)
	UpdateSessionToken(token string, id int) error
	UpdatePostCommentsCounter(postId int) error
	GetAllCategories() ([]string, error)
	GetPostList(category string) ([]models.Post, error)
	GetPostCategories(postID int) ([]string, error)
	GetPost(postId int) (models.Post, error)
	GetPostComments(postId int) ([]models.PostComment, error)
	GetUserHash(id int) (string, error)
	GetUserName(id int) (string, error)
	GetUserList() ([]models.Chatter, error)
	GetMessages(firstUserId int, secondUserId int, page int) ([]models.Message, error)
}
