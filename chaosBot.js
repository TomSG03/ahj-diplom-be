const Func = require('./func');

module.exports = class ChaosBot {
  constructor(clients) {
    this.clients = clients;
    this.botCommand = [];

    this.baseInfo = this.baseInfo.bind(this);

    this.init();
  }

  init() {
    this.botCommand.push({
      command: '?',
      type: 'list',
      title: 'Список команд:',
      variants: ['? - Список команд',
        'Погода - Погода',
        'Привет - Пример приветствия',
        'Избранное - Показать избранное',
        'Данные - Информация о хранилище'
      ],
    })
    this.botCommand.push({
      command: 'погода',
      type: 'random',
      title: 'Погода:',
      variants: ['Погода:<br><br>Температура: -20С<br>Давление: 760 мм р.ст.<br>Ветер: 5 м/с<br>Ощущается: Прохладно',
        'Погода:<br><br>Температура: -2С<br>Давление: 780 мм р.ст.<br>Ветер: 15 м/с<br>Ощущается: Свежо',
        'Погода:<br><br>Температура: 20С<br>Давление: 745 мм р.ст.<br>Ветер: 1 м/с<br>Осадки: дождь<br>',
        'Погода:<br><br>Температура: 25С<br>Давление: 745 мм р.ст.<br>Ветер: Нет<br>Облачность: Нет<br>',
      ],
    })
    this.botCommand.push({
      command: 'привет',
      type: 'random',
      title: '',
      variants: ['Доброго времени', 'Привет дружище', 'Здравствуй'],
    })
    this.botCommand.push({
      command: 'данные',
      type: 'funcIn',
      variants: this.baseInfo,
    })
    this.botCommand.push({
      command: 'избранное',
      type: 'funcOut',
      variants: [{ funcName: 'showFavorite', params: '' }],
    })
  }

  commandFind(msg) {
    const command = msg.slice(7).trim().toLowerCase();
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
      ['id']: '-1',
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
      ['id']: '-1',
      ['type']: 'txt',
      ['message']: obj.variants[Math.abs(Math.round(Math.random() * obj.variants.length - 1))],
      ['messageName']: obj.title,
      ['geo']: '',
      ['date']: Func.getTime(),
      ['favorite']: 'no',
    });
    this.clients.sendNewMsg(this.clients.message[this.clients.message.length - 1], 'message')
  }

  sendFuncIn(arrFunc) {
    const rezult = arrFunc();
    this.clients.message.push({
      ['source']: 'bot',
      ['id']: '-1',
      ['type']: 'txt',
      ['message']: `Состояние базы данных:<br><br>
                    Избранное: ${rezult.favorite}<br>
                    Текстовые соощения: ${rezult.txt}<br>
                    Сообщения содержащие ссылки: ${rezult.link}<br>
                    Картинки: ${rezult.image}<br>
                    Видео: ${rezult.video}<br>
                    Аудио: ${rezult.audio}<br>
                    Остальное: ${rezult.others}
                    `,
      ['messageName']: '',
      ['geo']: '',
      ['date']: Func.getTime(),
      ['favorite']: 'no',
    });
    this.clients.sendNewMsg(this.clients.message[this.clients.message.length - 1], 'message')

  }

  baseInfo() {
    const state = {
      favorite: 0,
      image: 0,
      txt: 0,
      link: 0,
      video: 0,
      audio: 0,
      others: 0,
    }

    for (let i = 0; i < this.clients.message.length; i += 1) {
      if (this.clients.message[i].favorite === 'yes') {
        state.favorite += 1;
      }
      if (this.clients.message[i].type.match(/txt/)) {
        state.txt += 1;
      } else
        if (this.clients.message[i].type.match(/link/)) {
          state.link += 1;
        } else
          if (this.clients.message[i].type.match(/video/)) {
            state.video += 1;
          } else
            if (this.clients.message[i].type.match(/audio/)) {
              state.audio += 1;
            } else
              if (this.clients.message[i].type.match(/image/)) {
                state.image += 1;
              } else {
                state.others += 1;
              }
    }
    return state;
  }

  sendFuncOut(func) {
    this.clients.sendEvent({ event: 'funcOut', id: func[0].params, value: func[0].funcName })
  }
}
