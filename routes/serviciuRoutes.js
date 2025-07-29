import express from 'express';
import {
  creareServiciu,
  modificaServiciu,
  stergeServiciu,
  getServicii,
  getServiciuById,
} from '../controllers/serviciuController.js';

const router = express.Router();

router.post('/', creareServiciu);
router.put('/:id', modificaServiciu);
router.delete('/:id', stergeServiciu);
router.get('/', getServicii);
router.get('/:id', getServiciuById);

export default router;
