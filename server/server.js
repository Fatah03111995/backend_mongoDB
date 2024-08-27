import express from 'express';
import http from 'http';
import { Server as socketIO } from 'socket.io';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const httpServer = http.createServer(app);
const io = new socketIO(httpServer);

const getReceiverSocket = (receiverId) => {
  return userSocket[receiverId];
};

const userSocket = {};

io.on('connection', (socket) => {
  console.log(`User connected with socketID: ${socket.id}`);
  const userId = socket.handshake.query.userId;

  io.emit('getOnlineUsers', Object.keys(userSocket));

  //-------------ON SEND MESSAGE
  socket.on('sendChat', async (payload) => {
    console.log({ payload });

    socket.broadcast.emit('newChat', payload);
  });

  socket.on('joinRoom', (userId) => {
    socket.join(userId);
  });

  //---------ON DISCONNECT
  socket.on('disconnect', () => {
    console.log(`User disconnected with socketID: ${socket.id}`);
    delete userSocket[userId];
    io.emit('getOnlineUsers', Object.keys(userSocket));
  });
});

export { app, io, httpServer, getReceiverSocket };
