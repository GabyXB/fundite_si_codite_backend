import express from 'express';
import { 
     addProduct,
     getAllProducts,
     getProductById,
     updateProduct,
     deleteProduct,
} from '../controllers/storeController.js';

const router = express.Router();

// Ruta pentru adăugarea unui produs

router.get('/', getAllProducts);      // Toate produsele
router.get('/:id', getProductById);   // Produs după ID
router.post('/add', addProduct);
router.put('/:id', updateProduct);  // Modificare produs
router.delete('/:id', deleteProduct);  // Ștergere produs

export default router;
