// server/src/controllers/auth.controller.ts
import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { sendVerificationEmail } from '../services/email.service.js';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'seu-segredo-super-secreto-para-desenvolvimento';
const frontendUrl = 'http://localhost:5173'; // A mesma URL do nosso serviço de e-mail

export const register = async (req: Request, res: Response) => {
    // ... (a função de registo que acabámos de criar permanece a mesma)
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }

    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Este e-mail já está em uso.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const emailVerificationToken = crypto.randomBytes(32).toString('hex');

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                emailVerificationToken: emailVerificationToken,
            },
        });

        await sendVerificationEmail(user.email, emailVerificationToken);

        res.status(201).json({ message: 'Registo realizado com sucesso! Por favor, verifique a sua caixa de entrada para ativar a sua conta.' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro interno no servidor ao tentar registar.' });
    }
};

// NOVO: Função para verificar o e-mail
export const verifyEmail = async (req: Request, res: Response) => {
    const { token } = req.query; // Pega o token da URL (ex: ?token=...)

    if (!token || typeof token !== 'string') {
        return res.status(400).send('Token de verificação inválido ou ausente.');
    }

    try {
        // 1. Encontra um utilizador com este token de verificação
        const user = await prisma.user.findUnique({
            where: { emailVerificationToken: token },
        });

        // Se nenhum utilizador for encontrado, o token é inválido ou já foi usado
        if (!user) {
            return res.status(404).send('Token de verificação inválido ou expirado.');
        }

        // 2. Se o utilizador for encontrado, atualizamos o seu registo
        await prisma.user.update({
            where: { id: user.id },
            data: {
                emailVerified: new Date(), // Marca o e-mail como verificado com a data atual
                emailVerificationToken: null, // Limpa o token para que não possa ser usado novamente
            },
        });

        // 3. Redireciona o utilizador para uma página de sucesso no frontend
        res.redirect(`${frontendUrl}/email-verified`);

    } catch (error) {
        console.error(error);
        res.status(500).send('Erro interno ao verificar o e-mail.');
    }
};


// ATUALIZADO: Função de login agora protegida
export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'E-mail e senha são obrigatórios.' });
    }

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'Credenciais inválidas.' });
        }

        // NOVA VERIFICAÇÃO: O e-mail do utilizador foi verificado?
        if (!user.emailVerified) {
            return res.status(403).json({ message: 'A sua conta ainda não foi ativada. Por favor, verifique o link de confirmação no seu e-mail.' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Credenciais inválidas.' });
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        const { password: _, ...userWithoutPassword } = user;

        res.json({ user: userWithoutPassword, token });

    } catch (error) {
        return res.status(500).json({ message: 'Erro interno no servidor.', error });
    }
};