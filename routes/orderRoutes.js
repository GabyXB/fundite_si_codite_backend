import express from 'express';
import { 
  adaugaProdus, 
  modificaCantitateProdus, 
  stergeProdus, 
  stergeComanda, 
} from '../controllers/orderController.js';

const router = express.Router();

// Adaugă un produs într-o comandă existentă
router.post('/:id/produs', adaugaProdus);

// Modifică cantitatea unui produs dintr-o comandă existentă
router.put('/:id/produs/:produs_id', modificaCantitateProdus);

// Șterge un produs dintr-o comandă (și restabilește stocul produsului)
router.delete('/:id/produs/:produs_id', stergeProdus);

// Șterge întreaga comandă (și restabilește stocurile pentru toate produsele din comandă)
router.delete('/:id', stergeComanda);

export default router;
