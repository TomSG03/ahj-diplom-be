const http = require('http');
const Koa = require('koa');
const cors = require('koa2-cors');
const uuid = require('uuid');

const WS = require('ws');
const app = new Koa();

const Clients = require('./clients');
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
          ['date']: request.date 
        });
        clients.idMessage += 1;
        clients.sendNewMsg(clients.message[clients.message.length - 1])
        break;
      case 'delete':
        const index = clients.message.findIndex((el) => el.id === Number(request.idDelete));
        clients.message.splice(index, 1);
        clients.sendDelete(request.idDelete);
        break;
      default:
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
