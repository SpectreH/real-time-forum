package socket

import (
	"database/sql"
	"encoding/json"
	"log"
	"real-time-forum/internal/models"
	"real-time-forum/internal/repository"
	"real-time-forum/internal/repository/dbrepo"
	"time"

	"github.com/gorilla/websocket"
)

// SocketReader is the socket reader model
type SocketReader struct {
	db   repository.DatabaseRepo
	conn *websocket.Conn
	name string
	id   int
}

var savedSocketReader []*SocketReader

// SetSocketReader creates a new socket reader
func SetSocketReader(conn *sql.DB) *SocketReader {
	return &SocketReader{
		db: dbrepo.SetSqliteRepo(conn),
	}
}

// AppendNewConnection appends a new user connection into array
func (sr *SocketReader) AppendNewConnection(conn *websocket.Conn, name string, id int) {
	if savedSocketReader == nil {
		savedSocketReader = make([]*SocketReader, 0)
	}

	ptrSocketReader := &SocketReader{
		conn: conn,
		db:   sr.db,
		name: name,
		id:   id,
	}

	savedSocketReader = append(savedSocketReader, ptrSocketReader)

	ptrSocketReader.startThread()
}

// setUserList gets all registered users and sets their current status (online/offline)
func (sr *SocketReader) setUserList() ([]models.Chatter, error) {
	chatters, err := sr.db.GetUserList(sr.id)
	if err != nil {
		log.Println(err)
		sr.closeConnection()
	}

	for i, chatter := range chatters {
		for _, connectedChatter := range savedSocketReader {
			if chatter.ID == sr.id {
				chatters[i].Myself = true
				chatters[i].Online = true
				continue
			}

			if chatter.ID == connectedChatter.id {
				chatters[i].Online = true
			}
		}
	}

	return chatters, err
}

func (sr *SocketReader) removeMultipleConnection() {
	for _, socket := range savedSocketReader {
		if socket == sr {
			continue
		}

		if socket.id == sr.id {
			socket.closeConnection()
		}
	}
}

// startThread connects user to chat
func (sr *SocketReader) startThread() {
	go func() {
		defer func() {
			err := recover()
			if err != nil {
				log.Println(err)
			}
			log.Println("thread socketreader finish")
			sr.closeConnection()
		}()

		sr.removeMultipleConnection()

		chatters, err := sr.setUserList()
		if err != nil {
			log.Println(err)
			sr.closeConnection()
		}

		err = sr.conn.WriteJSON(chatters)
		if err != nil {
			log.Println(err)
			sr.closeConnection()
		}

		sr.broadcastConnection(sr.id, true)

		for {
			sr.read()
		}
	}()
}

// broadcastConnection sends notify to users about new user connection
func (sr *SocketReader) broadcastConnection(id int, status bool) {
	for _, g := range savedSocketReader {
		if g == sr {
			continue
		}

		chatter := models.Chatter{
			Type:   "connection",
			ID:     id,
			Online: status,
		}

		if err := g.conn.WriteJSON(chatter); err != nil {
			log.Println(err)
			sr.closeConnection()
		}
	}
}

// broadcast sends message to user
func (sr *SocketReader) broadcast(message models.Message) {
	for _, g := range savedSocketReader {
		if message.ToUserID == g.id || g == sr {
			g.writeMsg(message)
		}
	}
}

// read reads messages from user
func (sr *SocketReader) read() {
	_, b, err := sr.conn.ReadMessage()
	if err != nil {
		panic(err)
	}

	message := models.Message{
		Created: time.Now(),
	}

	err = json.Unmarshal(b, &message)
	if err != nil {
		log.Println(err)
		sr.closeConnection()
		return
	}

	err = sr.db.InsertMessage(message)
	if err != nil && err != sql.ErrNoRows {
		log.Println(err)
		sr.closeConnection()
		return
	}

	message.FromUsername, err = sr.db.GetUserName(message.FromUserID)
	if err != nil {
		log.Println(err)
		sr.closeConnection()
		return
	}

	message.ToUsername, err = sr.db.GetUserName(message.ToUserID)
	if err != nil {
		log.Println(err)
		sr.closeConnection()
		return
	}

	sr.broadcast(message)
}

// writeMsg writes message to user
func (sr *SocketReader) writeMsg(message models.Message) {
	sr.conn.WriteJSON(message)
}

// closeConnection disconnects user and removes from the array
func (sr *SocketReader) closeConnection() {
	for i, socket := range savedSocketReader {
		if socket == sr {
			savedSocketReader = append(savedSocketReader[:i], savedSocketReader[i+1:]...)
			sr.broadcastConnection(sr.id, false)
			sr.conn.Close()
			return
		}
	}
}
