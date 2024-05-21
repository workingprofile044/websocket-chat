const WebSocket = require('ws');
const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let users = {};

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    const data = JSON.parse(message);
    switch (data.type) {
      case 'login':
        if (users[data.name]) {
          ws.send(JSON.stringify({ type: 'login', success: false }));
        } else {
          users[data.name] = ws;
          ws.name = data.name;
          ws.send(JSON.stringify({ type: 'login', success: true }));
          broadcastUserList();
        }
        break;
      case 'message':
        broadcastMessage(data);
        break;
      case 'logout':
        delete users[ws.name];
        broadcastUserList();
        break;
    }
  });

  ws.on('close', () => {
    if (ws.name) {
      delete users[ws.name];
      broadcastUserList();
    }
  });
});

function broadcastUserList() {
  const userList = Object.keys(users);
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type: 'userlist', users: userList }));
    }
  });
}

function broadcastMessage(data) {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

server.listen(8080, () => {
  console.log('Server is listening on port 8080');
});
