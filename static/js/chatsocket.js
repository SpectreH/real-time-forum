class ChatSocket {
  constructor() {
    this.chatSocket = null;
    this.userList = document.getElementById("user-list");
    this.myself = null;
    this.chat = null;
    this.currentChatPage = 0;
    this.currentPageIsLast = false;
    this.offsetToApply = 10;
    this.typingElement = null;
    this.typingInterval = null;
    this.stopTypingEngineTimeout = null;
  }

  async initialize() {
    await this.connectSocket()
  }

  static async create() {
    const o = new ChatSocket();
    await o.initialize();
    return o;
  }

  updateUserList(data) {
    let userElement;
    if (data.fromUserId == this.myself.id) {
      userElement = this.userList.querySelector(`#user-${data.toUserId}`)
    } else {
      userElement = this.userList.querySelector(`#user-${data.fromUserId}`)
    }
    userElement.remove()
    this.userList.insertBefore(userElement, this.userList.firstChild);
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

  runTypingEngine(whoIsTyping, fromUserId) {
    if (!this.chat || this.chat.getAttribute(`data-userid`) != `chat-${fromUserId}`) { return }

    if (this.stopTypingEngineTimeout) {
      clearTimeout(this.stopTypingEngineTimeout);
    }

    this.stopTypingEngineTimeout = window.setTimeout(function () {
      this.stopTypingEngine(fromUserId);
    }.bind(this), 1500)

    if (this.typingInterval != null) {
      return;
    }

    this.typingElement = document.querySelector("#real-typing");
    this.typingElement.innerHTML = `${whoIsTyping} is currently typing a message`;
    this.typingInterval = window.setInterval(this.animateRealTyping.bind(this), 500, whoIsTyping);
  }

  stopTypingEngine(fromUserId) {
    if (!this.typingElement) { return; }

    if (this.chat && this.chat.getAttribute(`data-userid`) != `chat-${fromUserId}` && fromUserId != -1) {
      return
    }

    clearTimeout(this.stopTypingEngineTimeout);
    clearTimeout(this.typingInterval);
    this.typingInterval = null;
    this.typingElement.innerHTML = "";
  }

  animateRealTyping(whoIsTyping) {
    if (!this.typingElement) { return; }

    if (this.typingElement.innerHTML.slice(-5) == ".....") {
      this.typingElement.innerHTML = `${whoIsTyping} is currently typing a message`;
      return;
    } 
    this.typingElement.innerHTML += ".";
  }

  showMessage(text) {
    this.updateUserList(text)
    if (text.toUserId == this.myself.id) {
      if (!this.chat || this.chat.getAttribute(`data-userid`) != `chat-${text.fromUserId}`) {
        GenerateAlertBox("message", `New message from <b>${text.fromUsername}</b>`)
      }
    }

    if ((!this.chat || this.chat.getAttribute(`data-userid`) != `chat-${text.fromUserId}`) && text.fromUserId != this.myself.id) {
      return
    }

    let timeInLocalTimeZone = new Date(new Date().setHours(new Date().getHours() + 2));
    let messageHTML = document.createElement("div");
    let changeScroll = false;
    if (this.chat.scrollTop == this.chat.scrollHeight - this.chat.offsetHeight) {
      changeScroll = true;
    }

    if (this.chat.querySelector("#no-messages")) {
      this.chat.querySelector("#no-messages").remove();
    }
    
    if (text.fromUserId == this.myself.id) {
      messageHTML.classList.add("chat-log-item");
    } else {
      messageHTML.classList.add("chat-log-item", "chat-log-item-own");
    }

    messageHTML.innerHTML = `
      <div class="chat-log-message-header">
        <h3>${text.fromUsername}</h3>
      </div>
      <div class="chat-log-message">${text.message}</div>
      <p class="chat-log-date mb-0 mt-3 font-weight-light">${getTime(timeInLocalTimeZone.toISOString())}</p>
    `; 

    this.chat.appendChild(messageHTML);

    if (changeScroll) {
      this.chat.scrollTop = this.chat.scrollHeight 
    }

    this.offsetToApply++;
    if (this.offsetToApply == 20) {
      this.currentChatPage++;
      this.offsetToApply = 10;
    }
  }

  send(text) {
    this.chatSocket.send(JSON.stringify(text))
  }

  keypress(e, toUser) {
    if (e.keyCode == 13) {
      e.preventDefault()

      if (e.target.value.replace(/\s/g, '').length != 0 && !Number.isNaN(toUser)) {
        let text = {
          type: "message",
          message: e.target.value,
          fromUserId: this.myself.id,
          toUserId: toUser
        }

        this.send(text);
      }

      e.target.value = "";
      return;
    }

    let text = {
      type: "start-typing",
      message: "",
      fromUserId: this.myself.id,
      toUserId: toUser
    }

    this.send(text);
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
        this.stopTypingEngine(data.fromUserId);
      } else if (data.type == "start-typing" && this.myself.id == data.toUserId) {
        this.runTypingEngine(data.fromUsername, data.fromUserId);
      } else if (data.type == "end-typing" && this.myself.id == data.toUserId) {
        this.stopTypingEngine(data.fromUserId);
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