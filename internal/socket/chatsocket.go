package socket

import (
	"database/sql"
	"log"
	"real-time-forum/internal/models"
	"real-time-forum/internal/repository"
	"real-time-forum/internal/repository/dbrepo"

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
	chatters, err := sr.db.GetUserList()
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

		for {
			sr.read()
		}
	}()
}

// broadcast sends messages to users
func (sr *SocketReader) broadcast(str string) {
	for _, g := range savedSocketReader {
		if g == sr {
			// no send message to himself
			continue
		}

		g.writeMsg(sr.name, str)
	}
}

// read reads messages from user
func (sr *SocketReader) read() {
	_, b, er := sr.conn.ReadMessage()
	if er != nil {
		panic(er)
	}
	log.Println(sr.name + " " + string(b))

	sr.broadcast(string(b))

	log.Println(sr.name + " " + string(b))
}

// writeMsg writes messages to users
func (sr *SocketReader) writeMsg(name string, str string) {
	sr.conn.WriteMessage(websocket.TextMessage, []byte("<b>"+name+": </b>"+str))
}

// closeConnection disconnects user and removes from the array
func (sr *SocketReader) closeConnection() {
	for i, socket := range savedSocketReader {
		if socket == sr {
			sr.conn.Close()
			savedSocketReader = append(savedSocketReader[:i], savedSocketReader[i+1:]...)
			return
		}
	}
}
