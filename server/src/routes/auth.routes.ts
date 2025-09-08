// server/src/routes/auth.routes.ts
import { Router } from 'express';
import { register, login, verifyEmail, forgotPassword, resetPassword } from '../controllers/auth.controller.js';

const router = Router();

// Rota para registrar um novo usuário
// Ex: POST http://localhost:3333/api/auth/register
router.post('/register', register);

// Rota para fazer login
// Ex: POST http://localhost:3333/api/auth/login
router.post('/login', login);
router.get('/verify-email', verifyEmail);

// Rotas para redefinição de senha
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;