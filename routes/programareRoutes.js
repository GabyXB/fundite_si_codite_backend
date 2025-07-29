import express from 'express';
import {
  creareProgramare,
  modificaProgramare,
  stergeProgramare,
  getProgramariByUserId,
  getProgramareById,
  confirmaProgramare,
  getProgramariByPet,
} from '../controllers/programareController.js';

const router = express.Router();

router.get('/user/:userId', getProgramariByUserId); // Toate programările unui user
router.get('/:id', getProgramareById); // O programare după ID
router.post('/creare', creareProgramare);
router.put('/modifica/:id', modificaProgramare);
router.delete('/sterge/:id', stergeProgramare);
router.put('/confirma/:id', confirmaProgramare); // Ruta nouă pentru confirmare
router.get('/pet/:petId', getProgramariByPet); // Toate programările pentru un animal

export default router;
