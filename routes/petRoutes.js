import express from 'express';
import { addPet, updatePet, deletePet , getPetsByUser , getPetById } from '../controllers/petController.js';
import verifyToken from '../middleware/verifyToken.js';

const router = express.Router();

// Ruta pentru crearea unui pet
router.post('/', verifyToken, addPet);

// Ruta pentru actualizarea unui pet
router.put('/:id', verifyToken, updatePet);

// Ruta pentru ștergerea unui pet
router.delete('/:id', verifyToken, deletePet);

router.get('/me', verifyToken, getPetsByUser);
router.get('/:id', getPetById);


export default router;
