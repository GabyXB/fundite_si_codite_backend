import express from 'express';
import { updateUser, deleteUser, getUserById } from '../controllers/userController.js'; // Asigură-te că ai importat corect controller-ul
import verifyToken from '../middleware/verifyToken.js';

const router = express.Router();

// Ruta pentru actualizarea unui utilizator
router.put('/:id', verifyToken, updateUser);

// Ruta pentru ștergerea unui utilizator
router.delete('/:id', verifyToken, deleteUser);

//Ruta pentru preluarea unui utilizator
router.get('/:id' , verifyToken,  getUserById);

export default router;
