module.exports = class Clients {
  constructor(server) {
    this.message = [];
    this.items = {};
    this.idMessage = 0;
    this.idMessageBot = 0;
  }

  sendValidOk(ws, count) {
    ws.send(JSON.stringify({ event: 'connect', message: 'ok', noSendMsg: count }));
  }

  jsonStr(obj, event) {
    return JSON.stringify({
      event: event,
      message: {
        source: obj.source,
        id: obj.id,
        type: obj.type,
        date: obj.date,
        geo: obj.geo,
        message: obj.message,
        messageName: obj.messageName,
        favorite: obj.favorite,
      },
    });
  }

  sendNewMsg(rec, event) {
    for (const key in this.items) {
      this.items[key].send(this.jsonStr(rec, event));
    }
  }

  sendOldMsg(ws, event) {
    this.message.forEach((e) => ws.send(this.jsonStr(e, event)));
  }

  sendNoSendMsg(ws, count) {
    const index = this.message.length - count;
    ws.send(this.jsonStr(this.message[count - 1], 'noSendMsg'));
  }

  sendAllFavorite(ws) {
    this.message.forEach((e) => {
      if (e.favorite === 'yes') {
        ws.send(this.jsonStr(e, 'favoriteAll'));
      }
    })
  }

  sendGroup(ws, rec) {
    this.message.forEach((e) => {
      const regexp = new RegExp(`${rec.value}`, 'g')
      if (e.type.match(regexp)) {
        ws.send(this.jsonStr(e, rec.event));
      }
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

  search(ws, rec) {
    this.message.forEach((e) => {
      if (rec.value !== '' && (e.type === 'txt' || e.type === 'link') && e.message.indexOf(rec.value) !== -1) {
        ws.send(this.jsonStr(e, 'search'));
      }
    })
  }
}
