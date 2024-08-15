import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserModel from '../models/UserModel.js';

class Auth {
  static async register(req, res) {
    try {
      const {
        userName,
        email,
        password,
        fcmToken,
        firstName,
        lastName,
        photoProfilePath,
      } = req.body;
      console.log(req.body);

      const salt = await bcrypt.genSalt();
      const passwordHash = await bcrypt.hash(password, salt);

      const newUser = UserModel({
        firstName,
        lastName,
        userName,
        email,
        password: passwordHash,
        fcmToken,
        photoProfilePath,
      });

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
        res.status(400).json({ message: "user-doesn't exist" });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        res.status(403).json({ message: 'invalid-credential' });
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
