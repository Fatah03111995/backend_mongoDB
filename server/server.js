import express from 'express';
import http from 'http';
import { Server as socketIO } from 'socket.io';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const httpServer = http.createServer(app);
const io = new socketIO(httpServer);

const getReceiverSocket = (receiverEmail) => {
  return userSocket[receiverEmail];
};

const userSocket = {};

io.on('connection', (socket) => {
  console.log(`User connected with socketID: ${socket.id}`);
  const userEmail = socket.handshake.query.userEmail;
  if (userEmail != 'undefined') {
    userSocket[userEmail] = socket.id;
  }
  console.log(userSocket);
  io.emit('getOnlineUsers', Object.keys(userSocket));

  //-------------ON SEND MESSAGE
  socket.on('sendChat', async (payload) => {
    console.log({ payload });
    socket.broadcast.emit('newChat', payload);
  });

  //---------ON DISCONNECT
  socket.on('disconnect', () => {
    console.log(`User disconnected with socketID: ${socket.id}`);
    delete userSocket[userEmail];
    io.emit('getOnlineUsers', Object.keys(userSocket));
  });
});

export { app, io, httpServer, getReceiverSocket };
