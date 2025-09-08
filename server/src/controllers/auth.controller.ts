import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { sendVerificationEmail, sendPasswordResetEmail } from '../services/email.service.js';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'seu-segredo-super-secreto-para-desenvolvimento';
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

// Função para validar a força da senha
const isPasswordStrong = (password: string) => {
    const minLength = 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
        return { valid: false, message: 'A senha deve ter no mínimo 8 caracteres.' };
    }
    if (!hasUppercase) {
        return { valid: false, message: 'A senha deve conter pelo menos uma letra maiúscula.' };
    }
    if (!hasLowercase) {
        return { valid: false, message: 'A senha deve conter pelo menos uma letra minúscula.' };
    }
    if (!hasNumber) {
        return { valid: false, message: 'A senha deve conter pelo menos um número.' };
    }
    if (!hasSpecialChar) {
        return { valid: false, message: 'A senha deve conter pelo menos um caracter especial (ex: !@#$%).' };
    }
    return { valid: true, message: '' };
};

export const register = async (req: Request, res: Response) => {
    const { name, password } = req.body;
    const email = req.body.email ? String(req.body.email).toLowerCase() : undefined;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }

    const passwordValidation = isPasswordStrong(password);
    if (!passwordValidation.valid) {
        return res.status(400).json({ message: passwordValidation.message });
    }

    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Este e-mail já está em uso.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const emailVerificationToken = crypto.randomBytes(32).toString('hex');

        const user = await prisma.user.create({
            data: { name, email, password: hashedPassword, emailVerificationToken },
        });

        await sendVerificationEmail(user.email, emailVerificationToken);

        res.status(201).json({ message: 'Registo realizado com sucesso! Por favor, verifique a sua caixa de entrada para ativar a sua conta.' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro interno no servidor ao tentar registar.' });
    }
};

export const verifyEmail = async (req: Request, res: Response) => {
    const { token } = req.query;

    if (!token || typeof token !== 'string') {
        return res.status(400).send('Token de verificação inválido ou ausente.');
    }

    try {
        const user = await prisma.user.findUnique({
            where: { emailVerificationToken: token },
        });

        if (!user) {
            return res.status(404).send('Token de verificação inválido ou expirado.');
        }

        await prisma.user.update({
            where: { id: user.id },
            data: {
                emailVerified: new Date(),
                emailVerificationToken: null,
            },
        });

        res.redirect(`${frontendUrl}/email-verified`);

    } catch (error) {
        console.error(error);
        res.status(500).send('Erro interno ao verificar o e-mail.');
    }
};

export const forgotPassword = async (req: Request, res: Response) => {
    const email = req.body.email ? String(req.body.email).toLowerCase() : undefined;

    if (!email) {
        return res.status(400).json({ message: 'O e-mail é obrigatório.' });
    }

    try {
        const user = await prisma.user.findUnique({ where: { email } });

        if (user) {
            const resetToken = crypto.randomBytes(32).toString('hex');
            const passwordResetExpires = new Date(Date.now() + 3600000); // 1 hora

            await prisma.user.update({
                where: { email },
                data: {
                    passwordResetToken: resetToken,
                    passwordResetExpires: passwordResetExpires,
                },
            });

            await sendPasswordResetEmail(user.email, resetToken);
        }

        res.json({ message: 'Se um utilizador com este e-mail existir, um link de redefinição foi enviado.' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro interno no servidor.' });
    }
};

export const resetPassword = async (req: Request, res: Response) => {
    const { token, password } = req.body;

    if (!token || !password) {
        return res.status(400).json({ message: 'Token e nova senha são obrigatórios.' });
    }

    const passwordValidation = isPasswordStrong(password);
    if (!passwordValidation.valid) {
        return res.status(400).json({ message: passwordValidation.message });
    }

    try {
        const user = await prisma.user.findFirst({
            where: {
                passwordResetToken: token,
                passwordResetExpires: { gt: new Date() },
            },
        });

        if (!user) {
            return res.status(400).json({ message: 'Token inválido ou expirado.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                passwordResetToken: null,
                passwordResetExpires: null,
            },
        });

        res.json({ message: 'Senha redefinida com sucesso!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro interno no servidor.' });
    }
};

export const login = async (req: Request, res: Response) => {
    const { password } = req.body;
    const email = req.body.email ? String(req.body.email).toLowerCase() : undefined;

    if (!email || !password) {
        return res.status(400).json({ message: 'E-mail e senha são obrigatórios.' });
    }

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'Credenciais inválidas.' });
        }

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