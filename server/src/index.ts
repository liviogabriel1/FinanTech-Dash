// server/src/index.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import walletRoutes from './routes/wallet.routes.js';
import { startScheduler } from './services/scheduler.service.js'; // 1. Importe a função
import scheduleRoutes from './routes/schedule.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3333;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/wallets', walletRoutes); 
app.use('/api/schedules', scheduleRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  startScheduler(); // 2. Inicie o agendador junto com o servidor
});