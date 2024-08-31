import ChatModel from '../models/ChatModel.js';
import { getReceiverSocket, io } from '../server/server.js';

class Chat {
  static async sendChat(req, res) {
    try {
      const { from, to, message } = req.body;

      const newRawData = ChatModel({
        from,
        to,
        message,
      });

      await newRawData.save();
      const newChat = await ChatModel.aggregate([
        {
          $match: {
            _id: newRawData._id,
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'from',
            foreignField: 'email',
            as: 'senderDetails',
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'to',
            foreignField: 'email',
            as: 'receiverDetails',
          },
        },
        {
          $unwind: '$senderDetails',
        },
        {
          $unwind: '$receiverDetails',
        },
      ]);

      const receiverSocketId = getReceiverSocket(to);

      if (receiverSocketId) {
        io.to(receiverSocketId).emit('newChat', newChat);
      }

      res.status(200).json({ newChat });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  static async getUserChat(req, res) {
    try {
      const { userEmail } = req.params;
      const chats = await ChatModel.aggregate([
        {
          $match: {
            $or: [
              {
                from: userEmail,
              },
              {
                to: userEmail,
              },
            ],
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'to',
            foreignField: 'email',
            as: 'receiverDetails',
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'from',
            foreignField: 'email',
            as: 'senderDetails',
          },
        },
        {
          $unwind: '$senderDetails',
        },
        {
          $unwind: '$receiverDetails',
        },
      ]);
      res.status(200).json(chats);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
}

export default Chat;
