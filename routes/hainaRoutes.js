import express from 'express';
import { 
  addHaina,
  getAllHaine,
  getHainaById,
  updateHaina,
  deleteHaina,
} from '../controllers/hainaController.js';

const router = express.Router();

router.get('/', getAllHaine);      // Toate hainele
router.get('/:id', getHainaById);   // Haină după ID
router.post('/add', addHaina);
router.put('/:id', updateHaina);  // Modificare haină
router.delete('/:id', deleteHaina);  // Ștergere haină

export default router; 