const Func = require('./func');

module.exports = class ChaosBot {
  constructor(clients) {
    this.clients = clients;
    this.botCommand = [];

    this.init();
  }

  commandFind(msg) {
    const command = msg.slice(7).trim().toLowerCase();
    this.clients.idMessageBot += 1;
    for (let i = 0; i < this.botCommand.length; i += 1) {
      if (this.botCommand[i].command === command) {
        switch (this.botCommand[i].type) {
          case 'list':
            this.sendList(this.botCommand[i]);
            break;
          case 'random':
            this.sendRandom(this.botCommand[i]);
            break;
          case 'funcIn':
            this.sendFuncIn(this.botCommand[i].variants);
            break;
          case 'funcOut':
            this.sendFuncOut(this.botCommand[i].variants);
            break;
              
          default:
            break;
        }
      }      
    }
  }

  sendList(obj) {
    this.clients.message.push({
      ['source']: 'bot',
      ['id']: this.clients.idMessageBot,
      ['type']: 'txt',
      ['message']: obj.variants.join('<br>'),
      ['messageName']: obj.title,
      ['geo']: '',
      ['date']: Func.getTime(),
      ['favorite']: 'no',
    });
    this.clients.sendNewMsg(this.clients.message[this.clients.message.length - 1], 'message')
  }

  sendRandom(obj) {
    this.clients.message.push({
      ['source']: 'bot',
      ['id']: this.clients.idMessageBot,
      ['type']: 'txt',
      ['message']: obj.variants[Math.abs(Math.round(Math.random() * obj.variants.length - 1))],
      ['messageName']: obj.title,
      ['geo']: '',
      ['date']: Func.getTime(),
      ['favorite']: 'no',
    });
    this.clients.sendNewMsg(this.clients.message[this.clients.message.length - 1], 'message')
  }

  init() {
    this.botCommand.push({
      command: '?',
      type: 'list',
      title: 'Список команд:',
      variants: ['Погода - Погода', 'Привет - Пример приветствия', 'Избанное - Показать избранное', 'База данных - Информация о хранилище' ],
    })
    this.botCommand.push({
      command: 'погода',
      type: 'random',
      title: 'Погода:',
      variants: ['Тепло', 'Прохладно', 'Идет дождь', 'Сильный снег'],
    })
    this.botCommand.push({
      command: 'привет',
      type: 'random',
      title: '',
      variants: ['Доброго времени', 'Привет дружище', 'Здравствуй'],
    })
    this.botCommand.push({
      command: 'база данных',
      type: 'funcIn',
      variants: [this.baseInfo],
    })
    this.botCommand.push({
      command: 'инфо',
      type: 'funcOut',
      variants: [this.systemInfo],
    })
  }
}
