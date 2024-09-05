import jwt from 'jsonwebtoken';

async function verifyToken(req, res, next) {
  try {
    let token = req.header('Authorization');
    if (token && token.startsWith('Bearer ')) {
      token = token.slice(7, token.length).trimLeft();
      const verified = jwt.verify(token, process.env.JWT_PASS);
      req.user = verified;
      return next();
    }
    res.status(403).json({ message: 'There is not token, please re login !' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

export default verifyToken;
