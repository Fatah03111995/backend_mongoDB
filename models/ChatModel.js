import mongoose from 'mongoose';

const ChatSchema = mongoose.Schema(
  {
    from: {
      type: String,
      required: true,
      max: 30,
    },
    to: {
      type: String,
      required: true,
      max: 30,
    },
    message: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const ChatModel = mongoose.model('chat', ChatSchema);
export default ChatModel;
