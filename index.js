/**
 * @format
 */

import sequelize from './config/database.js';
import express from 'express';
import orderRoutes from './routes/orderRoutes.js';
import storeRoutes from './routes/storeRoutes.js';
import petRoutes from './routes/petRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import programareRoutes from './routes/programareRoutes.js';
import serviciuRoutes from './routes/serviciuRoutes.js';
import hainaRoutes from './routes/hainaRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js';
import cors from 'cors';
import reviewRoutes from './routes/reviewRoutes.js';
import imageGenerationRoutes from './routes/imageGenerationRoutes.js';


const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

sequelize.authenticate()
  .then(() => console.log('✅ Conectat la baza de date!'))
  .catch((err) => console.error('❌ Eroare la conectarea cu baza de date:', err));

// Rutele API
app.use('/api/comenzi', orderRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/cos', cartRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/store', storeRoutes);
app.use('/api/users', userRoutes);
app.use('/api/programari', programareRoutes);
app.use('/api/servicii', serviciuRoutes);
app.use('/api/haine', hainaRoutes);
app.use('/api/angajati', employeeRoutes);
app.use('/api/recenzii', reviewRoutes);
app.use('/api/generate-image', imageGenerationRoutes);

const host = process.env.HOST || '0.0.0.0';

app.listen(port, host, () => {
  console.log(`🚀 Serverul rulează pe http://${host}:${port}`);
});

