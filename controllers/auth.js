import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserModel from '../models/UserModel.js';
import ChatModel from '../models/ChatModel.js';
import { io } from '../server/server.js';

class Auth {
  static async register(req, res) {
    try {
      const { userName, email, password, fcmToken, firstName, lastName } =
        req.body;

      const { path } = req.file;

      const salt = await bcrypt.genSalt();
      const passwordHash = await bcrypt.hash(password, salt);

      const urlPath = path.replace(/\\/g, '/').split('backend_mongoDB/')[1];

      const newUser = UserModel({
        firstName,
        lastName,
        userName,
        email,
        password: passwordHash,
        fcmToken,
        photoProfilePath: urlPath,
      });

      const isEmailExist = await UserModel.findOne({ email });
      if (isEmailExist) {
        res.status(400).json({ message: 'email-already-used' });
        return;
      }
      const isUserNameExist = await UserModel.findOne({ userName });
      if (isUserNameExist) {
        res.status(400).json({ message: 'username-already-used' });
        return;
      }
      const savedUser = await newUser.save();
      res.status(200).json(savedUser);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await UserModel.findOne({ email: email });
      if (!user) {
        res.status(400).json({ message: "user-doesn't-exist" });
        return;
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        res.status(403).json({ message: 'invalid-credential' });
        return;
      }

      const token = jwt.sign({ id: user._id }, process.env.JWT_PASS);
      delete user.password;
      res.status(200).json({ token, user });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
}

export default Auth;
