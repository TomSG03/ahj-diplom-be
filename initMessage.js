const Func = require('./func');

module.exports = class InitMessage {
  constructor(clients) {
    this.clients = clients;

    this.init();
  }

  init() {

    const information = [
      {
        source: 'user',
        type: 'txt',
        message: 'Окружающий мир это совокупность окружающих человека объектов живой и неживой природы, а также результатов деятельности самой человеческой цивилизации',
        favorite: 'yes',
      },
      {
        source: 'user',
        type: 'txt',
        message: 'Примеры живой природы: дерево, трава, человек, кошка, птица, муха, муравей и другие живые организмы',
        favorite: 'no',
      },
      {
        source: 'user',
        type: 'txt',
        message: 'Примеры неживой природы: горы, реки, моря, песок, камни, воздух, солнечный свет и т.п.',
        favorite: 'no',
      },
      {
        source: 'user',
        type: 'link',
        message: 'https://www.rainymood.com/ - слушать дождь',
        favorite: 'no',
      },
      {
        source: 'user',
        type: 'link',
        message: 'http://bomomo.com/ - рисовать абстракции',
        favorite: 'no',
      },
      {
        source: 'user',
        type: 'link',
        message: 'https://thisissand.com/ - сыпать песок',
        favorite: 'no',
      },
      {
        source: 'user',
        type: 'txt',
        message: '@chaos: ?',
        favorite: 'no',
      },
      {
        source: 'bot',
        type: 'txt',
        message: 'Список команд:<br><br>? - Список команд<br>Погода - Погода<br>Привет - Пример приветствия<br>Избранное - Показать избранное<br>Данные - Информация о хранилище',
        favorite: 'no',
      },
    ]

    for (let i = 0; i < information.length; i += 1) {
      this.clients.message.push({
        ['source']: information[i].source,
        ['id']: this.clients.idMessage,
        ['type']: information[i].type,
        ['message']: information[i].message,
        ['messageName']: information.messageName || '',
        ['geo']: '',
        ['date']: Func.getTime(),
        ['favorite']: information[i].favorite,
      });
      this.clients.idMessage += 1;
    }
  }
}

