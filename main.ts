import express from 'express';
import { Request, Response } from 'express';
import formidable from 'formidable';
import PersistentFile from 'formidable/PersistentFile';
import bodyParser from 'body-parser';

import { v4 as uuid } from 'uuid';

import {
  Server as SocketServer,
  WebSocket,
} from 'ws';

import fs from 'fs';
import path, { join } from 'path';

import {
  WebSocketPackage,
  ClientSendMessage,
  ServerSendInitMessage,
  PackageType,
  ClientSendInitMessage,
  Sender,
} from './types/web-socket';

interface UserRequest extends Request {
  name: string,
  age: number,
}

const uploadFolder = path.join(__dirname, )

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));


app.post<{
  name: string,
  age: number,
}>('/user', (request, response) => {
  console.log(request.body);
  response.send('gg');
});

app.get('/', (request, response) => {
  response.send('The server is working~~');
});

app.post('/upload/file', (request, response, next) => {
  const form = formidable({
    multiples: true,
  });

  console.log(request);


  form.parse(request, (error, fields, files) => {
    if (error) {
      next(error);
      return ;
    }

    // console.log({
    //   fields,
    //   files
    // });

    response.json({
      fields,
      files
    });
  });
});

const server = app.listen(port, () => {
  if (port === 3000) {
    console.log('true');
  }

  console.log(`server is listening on ${port} !!!`);
})


const wss = new SocketServer({ server });

wss.on('connection', ws => {
  let from: Sender | null;

  ws.on('message', data => {
    const clients = wss.clients;

    const message = JSON.parse(data.toString());

    if (message.type === 'client-init') {
      from = serverInit(
        ws, clients,
        message as WebSocketPackage<ClientSendInitMessage>
      );
    }

    if (message.type === 'client-send-message') {
      if (!from) {
        throw Error('Not init.');
      }
      serverSendMessage(
        from, ws, clients,
        message as WebSocketPackage<ClientSendMessage>
      );
    }

  });

  ws.on('close', (code, reason) => {
    console.log(`close, Code: ${code}, Reason: ${reason}`);
  });
})


function serverInit(
  target: WebSocket,
  clients: Set<WebSocket>,
  message: WebSocketPackage<ClientSendInitMessage>,
): Sender {
  const from = {
    name: message.data.name,
    id: uuid(),
  } as Sender;
  let welcomeMessage = {
    type: 'server-send-message',
    from,
    data: {
      message: `${message.data.name} 已進入！`,
    },
  } as WebSocketPackage<ClientSendMessage>;

  let initMessage = {
    type: 'server-init',
    from,
    data: {
      id: from.id,
    }
  } as WebSocketPackage<ServerSendInitMessage>;

  clients.forEach(client => client.send(JSON.stringify(welcomeMessage)));

  target.send(JSON.stringify(initMessage));

  return from;
}

function serverSendMessage(
  from: Sender,
  target: WebSocket,
  clients: Set<WebSocket>,
  message: WebSocketPackage<ClientSendMessage>
) {
  const replayMessage = {
    type: 'server-send-message',
    from,
    data: {
      message: message.data.message,
      from,
    }
  } as WebSocketPackage<ClientSendMessage>;
  clients.forEach(client => client.send(JSON.stringify(replayMessage)));
}
