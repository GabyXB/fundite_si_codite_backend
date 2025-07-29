import express from 'express';
import {
  createCart,
  addProductToCart,
  getCart,
  finalizeOrder,
  scoateProdusDinCos,
  modificaCantitateProdusInCos,
} from '../controllers/cartController.js';

const router = express.Router();

router.post('/creaza', createCart); // Creare coș
router.post('/adaugare', addProductToCart); // Adăugare produs în coș
router.get('/vezi', getCart); // Vizualizare coș
router.post('/finalizeaza', finalizeOrder); // Finalizare comandă
router.delete('/scoate', scoateProdusDinCos); // Scoatere produs din coș
router.put('/modifica', modificaCantitateProdusInCos); // Modificare cantitate produs în coș

export default router;
