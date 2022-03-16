class ChatSocket {
  constructor() {
    this.chatSocket = null;
    this.userList = document.getElementById("user-list");
    this.myself = null;
    this.chat = null;
    this.currentChatPage = 0;
    this.currentPageIsLast = false;
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
    users.forEach(user => {
      let element = document.createElement("div");

      element.innerHTML = `
        <div class="d-flex align-items-center" id="user-${user.id}">
          <svg class="bd-placeholder-img flex-shrink-0 me-2 rounded-circle" width="16" height="16" xmlns="http://www.w3.org/2000/svg"
            role="img" focusable="false">
            <rect width="100%" height="100%" />
          </svg>
          <span class="pe-2">${user.username}</span>
          <a href="JavaScript:void(0);" onclick="router.loadRoute('chat', '${user.id}')">
            <svg width="16" height="16">
              <use xlink:href="#email" />
            </svg>
          </a>
        </div>
      `;

      this.changeUserStatus(element, user.id, user.online);

      if (!user.myself) {
        this.userList.append(element);
      } else {
        this.myself = user;
      }
    });
  }

  changeUserStatus(element, id, status) {
    let userElement = element.querySelector(`#user-${id}`)

    if (userElement == undefined) {
      return
    }

    if (status) {
      userElement.classList.add("user-online");
      userElement.classList.remove("user-offline");
    } else {
      userElement.classList.add("user-offline");
      userElement.classList.remove("user-online");
    }
  }

  showMessage(text) {
    let timeInLocalTimeZone = new Date(new Date().setHours(new Date().getHours() + 2));
    let messageHTML = document.createElement("div");
    let changeScroll = false;
    if (this.chat.scrollTop == this.chat.scrollHeight - this.chat.offsetHeight) {
      changeScroll = true;
    }

    messageHTML.innerHTML = `
      <div class="chat-log-message-header">
        <h3>Qwerty</h3>
      </div>
      <div class="chat-log-message">${text.message}</div>
      <p class="chat-log-date mb-0 mt-3 font-weight-light">${getTime(timeInLocalTimeZone.toISOString())}</p>
    `;      

    if (text.fromUserId == this.myself.id) {
      messageHTML.classList.add("chat-log-item");
    } else {
      messageHTML.classList.add("chat-log-item", "chat-log-item-own");
    }

    this.chat.appendChild(messageHTML);

    if (changeScroll) {
      this.chat.scrollTop = this.chat.scrollHeight 
    }
  }

  send(text) {
    if (Number.isNaN(text.toUser)) { return }
    this.chatSocket.send(JSON.stringify(text))
  }

  keypress(e, toUser) {
    if (e.keyCode == 13) {
      e.preventDefault()

      if (e.target.value.replace(/\s/g, '').length != 0) {
        let text = {
          type: "message",
          message: e.target.value,
          fromUserId: this.myself.id,
          toUserId: toUser
        }

        this.send(text);
        this.showMessage(text);
      }

      e.target.value = "";
    }
  }

  async connectSocket() {
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

      if (data.type == "connection") {
        this.changeUserStatus(this.userList, data.id, data.online);
      } else if (data.type == "message") {
        this.showMessage(data);
      }
    }
    socket.onopen = () => {
      console.log("socket opend")
    };
    socket.onclose = () => {
      console.log("socket close")
    }
  }
}