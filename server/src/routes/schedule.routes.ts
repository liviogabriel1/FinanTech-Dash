// server/src/routes/schedule.routes.ts
import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { createSchedule, getSchedulesByWallet, deleteSchedule } from '../controllers/schedule.controller.js';

const router = Router();

// Protege todas as rotas com autenticação
router.use(authMiddleware);

router.post('/', createSchedule);
router.get('/wallet/:walletId', getSchedulesByWallet);
router.delete('/:scheduleId', deleteSchedule);

export default router;