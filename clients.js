module.exports = class Clients {
  constructor(server) {
    this.message = [];
    this.items = {};
    this.idMessage = 0;
  }

  sendValidOk(ws) {
    ws.send(JSON.stringify({ event: 'connect', message: 'ok' }));
  }

  sendNewMsg(rec) {
    for (const key in this.items) {
      const chatEvent = JSON.stringify({
        event: 'message',
        message: {
          id: rec.id,
          type: rec.type,
          date: rec.date,
          message: rec.message,
          messageName: rec.messageName,
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
          id: e.id,
          type: e.type,
          message: e.message,
          messageName: e.messageName,
          date: e.date,          
        },
      });
      ws.send(chatEvent);
    })
  }

  sendDelete(idDelete) {
    for (const key in this.items) {
      const chatEvent = JSON.stringify({
        event: 'delete',
        idDelete: idDelete,
      });
      this.items[key].send(chatEvent);
    }
  }
}
