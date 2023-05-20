const { Server } = require('socket.io');
const notiModel = require('../models/notification.model');

module.exports = function (server) {
  const io = new Server(server, {
    cors: {
      origin: '*',
    },
  });

  io.on('connection', function (client) {
    let room;
    client.on('join', function (data) {
      room = data;
      client.join(room);
    });
    client.on('messages', async function (res) {
      io.to(room).emit('thread', res);
      if (!res.isDuplicate && res?.data?.type !== 'CHAT') {
        await notiModel.create(res.data);
      }
    });
  });
};
