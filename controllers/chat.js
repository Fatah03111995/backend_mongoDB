import ChatModel from '../models/ChatModel.js';
import { io } from '../server/server.js';

class Chat {
  static async sendChat(req, res) {
    try {
      const { from, to, message } = req.body;

      const newChat = ChatModel({
        from,
        to,
        message,
      });

      await newChat.save();

      io.emit('newChat', newChat);

      res.status(200).json({ message: 'has-sended' });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  static async getUserChatToSpesific(req, res) {
    try {
      const { userId, toId } = req.params;
      const chatFromUser = await ChatModel.find({ from: userId })
        .find({ to: toId })
        .exec();
      const chatFromTo = await ChatModel.find({ from: toId })
        .find({ to: userId })
        .exec();
      const chats = [...chatFromUser, ...chatFromTo] ?? [];
      if (chats.length == 0) {
        res.status(404).json({ message: 'chat-not-found' });
        return;
      }
      res.status(200).json(chats);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
}

export default Chat;
