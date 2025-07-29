import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';
import verifyToken from '../middleware/verifyToken.js';

const router = express.Router();

// Ruta pentru înregistrare
router.post('/signup', registerUser);

// Ruta pentru login
router.post('/login', loginUser);

// Ruta pentru verificarea token-ului
router.get('/verify-token', verifyToken, (req, res) => {
  res.status(200).json({ success: true, userId: req.user.id });
});

// Ruta protejată pentru profil
router.get('/profile', verifyToken, (req, res) => {
  res.status(200).json({ message: 'Acces permis!', user: req.user });
});

export default router;
