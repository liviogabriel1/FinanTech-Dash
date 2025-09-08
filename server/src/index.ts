import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import walletRoutes from './routes/wallet.routes.js';
import { startScheduler } from './services/scheduler.service.js';
import scheduleRoutes from './routes/schedule.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3333;

// A URL do frontend agora vem das variáveis de ambiente
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// MUDANÇA CRUCIAL: Configuração dinâmica do CORS
app.use(cors({
  origin: FRONTEND_URL
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/wallets', walletRoutes); 
app.use('/api/schedules', scheduleRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Servidor a rodar na porta ${PORT}`);
  startScheduler();
});
