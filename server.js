const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: process.env.PORT || 8080 });

let liveLocations = {};

wss.on('connection', (ws) => {
  console.log('Transporter connected.');

  ws.on('message', (message) => {
    const locationData = JSON.parse(message);
    console.log('Location received:', locationData);

    liveLocations[locationData.transporterId] = locationData;

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: 'locationUpdate', data: liveLocations }));
      }
    });
  });

  ws.on('close', () => {
    console.log('Transporter disconnected.');
  });
});
