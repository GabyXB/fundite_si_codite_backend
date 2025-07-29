import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: 'Token lipsă. Autentificare necesară.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token invalid.' });
    req.user = user; // info-ul decodificat din token (ex: userId, email)
    next();
  });
};

export default authenticateToken;
