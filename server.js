const http = require('http');
const Koa = require('koa');
const cors = require('koa2-cors');
const uuid = require('uuid');

const WS = require('ws');
const app = new Koa();

const Clients = require('./clients');
const Func = require('./func');
const clients = new Clients();

const port = process.env.PORT || 7070;
const server = http.createServer(app.callback());
const wsServer = new WS.Server({ server });



app.use(
  cors({
    origin: '*',
    credentials: true,
    'Access-Control-Allow-Origin': true,
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
  })
);

wsServer.on('connection', (ws) => {
  const id = uuid.v4();
  ws.on('message', (msg) => {
    const request = JSON.parse(msg);
    switch (request.event) {
      case 'connected':
        clients.items[id] = ws;
        clients.sendValidOk(ws);
        clients.sendOldMsg(ws);
        break;
      case 'message':
        clients.message.push({
          ['id']: clients.idMessage,
          ['type']: request.type, 
          ['message']: request.message, 
          ['messageName']: request.messageName, 
          ['geo']: request.geo,
          ['date']: request.date,
          ['favorite']: request.favorite,
        });
        clients.idMessage += 1;
        clients.sendNewMsg(clients.message[clients.message.length - 1])
        console.log(clients.message[clients.message.length - 1].type);
        break;
      case 'delete':
        clients.message.splice(Func.indexItem(clients.message, request.id), 1);
        clients.sendEvent({ 
          event: 'delete', 
          id: request.id,
          value: 0,
        });
          break;
      case 'deleteAll':
        clients.message = [];
        clients.sendEvent({ 
          event: 'deleteAll', 
          id: 0,
          value: 0,
        });
        break;
      case 'favorite':
        const index = Func.indexItem(clients.message, request.id);
        clients.message[Func.indexItem(clients.message, request.id)].favorite = request.value;
        clients.sendEvent({
          event: 'favorite',
          id: request.id,
          value: clients.message[Func.indexItem(clients.message, request.id)].favorite,
        });
        break;
        case 'getFavoriteAll':
          clients.sendAllFavorite(ws);
          break;
        default:
        case 'getGroup':
          clients.sendGroup(ws, request);
          break;
        break;
    }
  });

  ws.on('close', () => {
    if (typeof clients.items[id] !== "undefined") {
      delete clients.items[id];
    }
  });
});

server.listen(port, () => console.log(`Server has been started on ${port}...`));
