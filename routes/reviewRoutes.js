import express from 'express';
import { creeazaRecenzie, stergeRecenzie, modificaRecenzie, getRecenzieByUser, getRecenzii } from '../controllers/reviewController.js';

const router = express.Router();

router.post('/', creeazaRecenzie);
router.delete('/:id', stergeRecenzie);
router.put('/:id', modificaRecenzie);
router.get('/user/:user_id', getRecenzieByUser);
router.get('/', getRecenzii);

export default router; 