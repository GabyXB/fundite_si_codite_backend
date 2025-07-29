import express from 'express';
import { 
  generatePetClothingPreview
} from '../controllers/imageGenerationController.js';

const router = express.Router();

// Rută de test pentru a verifica dacă serverul funcționează
router.get('/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Image generation server is working!',
    timestamp: new Date().toISOString()
  });
});

// Rută pentru preview-ul cu animale îmbrăcate în haine
router.post('/preview-clothing', generatePetClothingPreview);

export default router; 