import UserModel from '../models/UserModel.js';

class UserController {
  static async getUserById(req, res) {
    const { userId } = req.params;
    try {
      const findedUser = UserModel.find({ _id: userId });

      if (!findedUser) {
        res.status(400).json({ message: 'not - found' });
      }
      delete findedUser.password;
      res.status(200).json(findedUser);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  static async getUserByList(req, res) {
    const { friends } = req.body;
    try {
      const findedUsers = await UserModel.find({ _id: { $in: friends } });

      if (!findedUsers) {
        res.status(400).json({ message: 'not-found' });
      }
      console.log(findedUsers);
      res.status(200).json(findedUsers);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
}

export default UserController;
