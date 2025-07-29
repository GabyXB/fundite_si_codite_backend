import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token lipsă. Autentificare necesară.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Aici extragem userId corect și îl salvăm sub forma req.user.id
    req.user = { id: decoded.userId };

    // Debug
    console.log('✅ Token decodat:', decoded);
    console.log('✅ ID extras în req.user.id:', req.user.id);

    next();
  } catch (error) {
    console.error('❌ Eroare la verificarea tokenului:', error);
    return res.status(403).json({ message: 'Token invalid.' });
  }
};

export default verifyToken;
