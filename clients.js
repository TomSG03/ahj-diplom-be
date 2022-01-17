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
          geo: rec.geo,
          message: rec.message,
          messageName: rec.messageName,
          favorite: rec.favorite,
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
          geo: e.geo,
          date: e.date,
          favorite: e.favorite,
        },
      });
      ws.send(chatEvent);
    })
  }

  sendEvent(obj) {
    for (const key in this.items) {
      const chatEvent = JSON.stringify({
        event: obj.event,
        id: obj.id,
        value: obj.value,
      });
      this.items[key].send(chatEvent);
    }
  }

  sendAllFavorite(ws) {
    this.message.forEach((e) => {
      if (e.favorite === 'yes') {
        const chatEvent = JSON.stringify({
          event: 'favoriteAll',
          message: {
            id: e.id,
            type: e.type,
            message: e.message,
            messageName: e.messageName,
            geo: e.geo,
            date: e.date,
            favorite: e.favorite,
          },
        });
        ws.send(chatEvent);
      }
    })
  }
}
