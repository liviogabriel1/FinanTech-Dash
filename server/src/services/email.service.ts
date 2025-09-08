// server/src/services/email.service.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const backendUrl = process.env.RAILWAY_STATIC_URL
    ? `https://` + process.env.RAILWAY_STATIC_URL
    : 'http://localhost:3333';

const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

export const sendVerificationEmail = async (to: string, token: string) => {
    const verificationLink = `${backendUrl}/api/auth/verify-email?token=${token}`;
    try {
        await resend.emails.send({
            from: 'FinanTech Dash <onboarding@resend.dev>',
            to: to,
            subject: 'Confirme seu E-mail - FinanTech Dash',
            html: `<h1>Bem-vindo!</h1><p>Clique no link para verificar seu e-mail: <a href="${verificationLink}">Verificar</a></p>`,
        });
        console.log(`✉️ E-mail de verificação enviado para ${to}`);
    } catch (error) {
        console.error("❌ Erro ao enviar e-mail de verificação com Resend:", error);
        throw new Error('Falha ao enviar e-mail de verificação.');
    }
};

export const sendPasswordResetEmail = async (to: string, token: string) => {
    const resetLink = `${frontendUrl}/reset-password?token=${token}`;
    try {
        await resend.emails.send({
            from: 'FinanTech Dash <onboarding@resend.dev>',
            to: to,
            subject: 'Redefinição de Senha - FinanTech Dash',
            html: `<h1>Redefinição de Senha</h1><p>Clique no link para redefinir sua senha: <a href="${resetLink}">Redefinir Senha</a></p>`,
        });
        console.log(`✉️ E-mail de redefinição de senha enviado para ${to}`);
    } catch (error) {
        console.error("❌ Erro ao enviar e-mail de redefinição com Resend:", error);
        throw new Error('Falha ao enviar e-mail de redefinição.');
    }
};