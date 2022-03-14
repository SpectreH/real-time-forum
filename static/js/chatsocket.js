class ChatSocket {
  constructor() {
    this.chatSocket = null;
    this.userList = document.getElementById("user-list");
  }

  async initialize() {
    await this.connectSocket()
  }

  static async create() {
    const o = new ChatSocket();
    await o.initialize();
    return o;
  }

  loadUserList(users) {
    users.filter(u => !u.myself).forEach(user => {
      let element = document.createElement("div");
      
      element.innerHTML = `
        <div class="d-flex align-items-center" id="user-list-user">
          <svg class="bd-placeholder-img flex-shrink-0 me-2 rounded-circle" width="16" height="16" xmlns="http://www.w3.org/2000/svg"
            role="img" focusable="false">
            <rect width="100%" height="100%" />
          </svg>
          <span class="pe-2">${user.username}</span>
          <a href="">
            <svg width="16" height="16">
              <use xlink:href="#email" />
            </svg>
          </a>
        </div>
      `;

      if (user.online) {
        element.querySelector("#user-list-user").classList.add("user-online");
      } else {
        element.querySelector("#user-list-user").classList.add("user-offline");
      }

      this.userList.append(element);
    });
  }

  showMessage(text, myself) {
    console.log(text)
  }

  send() {
    console.log("send")
    //this.mysocket.send(txt);
  }

  keypress(e) {
    if (e.keyCode == 13) {
      this.send();
    }
  }

  async connectSocket() {
    console.log("memulai socket");
    var socket = new WebSocket("ws://localhost:9000/socket");
    this.chatSocket = socket;

    socket.onmessage = (e) => {
      let data = null;

      try {
        data = JSON.parse(e.data)
      } catch (e) {}

      if (Array.isArray(data)) {
        this.loadUserList(data)
        return
      }

      this.showMessage(e.data, false);
    }
    socket.onopen = () => {
      console.log("socket opend")
    };
    socket.onclose = () => {
      console.log("socket close")
    }
  }
}