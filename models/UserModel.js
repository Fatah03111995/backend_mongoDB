import mongoose from 'mongoose';

const UserSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      max: 10,
    },
    lastName: {
      type: String,
      default: '',
      max: 30,
    },
    userName: {
      type: String,
      required: true,
      max: 30,
    },
    email: {
      type: String,
      required: true,
      max: 30,
    },
    password: {
      type: String,
      required: true,
      min: 6,
    },
    fcmToken: {
      type: String,
      default: '',
    },

    photoProfilePath: {
      type: String,
      default: '',
    },
    listFriend: {
      type: Array,
      default: [],
    },
    status: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model('User', UserSchema);
export default UserModel;
