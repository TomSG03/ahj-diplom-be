module.exports = class Clients {
  constructor(server) {
    this.items = {};
    this.message = [];
  }

  checkNikName(message) {
    let userLogged = false;
    if (Object.keys(this.items).length > 0) {
      for (const key in this.items) {
        if (this.items[key].name === message) {
          userLogged = true;
        }
      }
    }
    return userLogged;
  }

  sendValidOk(ws) {
    ws.send(JSON.stringify({ event: 'connect', message: ws.name }));
  }

  sendAllClientEvent(event) {
    const list = this.getClientList();
    for (const key in this.items) {
      const chatEvent = JSON.stringify({
        event: 'system',
        message: {
          action: event,
          users: list,
        },
      });
      this.items[key].send(chatEvent);
    }
  }

  sendAllNewMsg(message) {
    const list = this.getClientList();
    for (const key in this.items) {
      const chatEvent = JSON.stringify({
        event: 'message',
        message: {
          name: this.items[key].name,
          date: new Date(),
          text: message,
        },
      });
      this.items[key].send(chatEvent);
    }
  }

  sendOldMsg(ws) {
    this.message.forEach((e) => {
      const chatEvent = JSON.stringify({
        event: 'message',
        message: {
          name: e.nikName,
          date: new Date(),
          text: e.message,
        },
      });
      ws.send(chatEvent);
    })
  }

  getClientList() {
    const list = [];
    for (const key in this.items) {
      list.push(this.items[key].name)
    };
    return list
  }
}
