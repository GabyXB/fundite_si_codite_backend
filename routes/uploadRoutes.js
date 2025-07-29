import express from 'express';
import multer from 'multer';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import s3Client from '../config/s3.js';
import { s3Config } from '../config/database.js';
import verifyToken from '../middleware/verifyToken.js';


const router = express.Router();

// Configurare multer pentru încărcarea fișierelor
const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Doar fișierele imagine sunt permise!'), false);
        }
    }
});

// Endpoint pentru încărcarea unei imagini
router.post('/', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Nu a fost furnizat niciun fișier' });
        }

        const file = req.file;
        const key = `images/${Date.now()}-${file.originalname}`;

        const command = new PutObjectCommand({
            Bucket: s3Config.bucketName,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
        });

        await s3Client.send(command);

        const imageUrl = `https://${s3Config.bucketName}.s3.${s3Config.region}.amazonaws.com/${key}`;
        res.json({ 
            success: true,
            imageUrl 
        });
    } catch (error) {
        console.error('Eroare la încărcarea fișierului:', error);
        res.status(500).json({ 
            error: 'Eroare la încărcarea fișierului',
            details: error.message 
        });
    }
});

router.post('/review', verifyToken, async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) {
            return res.status(400).json({ error: 'Textul recenziei lipseste' });
        }
        const key = `reviews/${Date.now()}-review.json`;
        const body = Buffer.from(JSON.stringify({ text }), 'utf-8');
        const command = new PutObjectCommand({
            Bucket: s3Config.bucketName,
            Key: key,
            Body: body,
            ContentType: 'application/json',
        });
        await s3Client.send(command);
        const link = `https://${s3Config.bucketName}.s3.${s3Config.region}.amazonaws.com/${key}`;
        res.json({ link });
    } catch (error) {
        console.error('Eroare la upload text review:', error);
        res.status(500).json({ error: 'Eroare la upload text review', details: error.message });
    }
});

export default router; 