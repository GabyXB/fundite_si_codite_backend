import express from 'express';
import { creeazaAngajat, stergeAngajat, modificaAngajat, getAngajati } from '../controllers/employeeController.js';

const router = express.Router();

router.post('/', creeazaAngajat);
router.delete('/:id', stergeAngajat);
router.put('/:id', modificaAngajat);
router.get('/', getAngajati);

export default router; 