package handlers

import (
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

// CreateSocketReader is the handler for new web socket connection
func (m *Repository) CreateSocketReader(w http.ResponseWriter, r *http.Request) {
	id := checkForCookies(r, w)
	name, err := m.DB.GetUserName(id)
	if err != nil {
		log.Println(err)
		return
	}

	defer func() {
		err := recover()
		if err != nil {
			log.Println(err)
		}
		r.Body.Close()
	}()

	con, _ := upgrader.Upgrade(w, r, nil)

	m.SR.AppendNewConnection(con, name, id)
}
