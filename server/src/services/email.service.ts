// server/src/services/email.service.ts
import nodemailer from 'nodemailer';

const backendUrl = 'http://localhost:3333';

// 1. Configuração do "Transportador" de e-mail usando as credenciais do .env
const transporter = nodemailer.createTransport({
    service: 'gmail', // Usando o serviço do Gmail
    auth: {
        user: process.env.EMAIL_USER, // O e-mail que criámos
        pass: process.env.EMAIL_PASS, // A senha de app de 16 dígitos
    },
});

/**
 * Envia um e-mail de verificação para o utilizador.
 * @param to O e-mail do destinatário.
 * @param token O token de verificação único.
 */
export const sendVerificationEmail = async (to: string, token: string) => {
    const verificationLink = `${backendUrl}/api/auth/verify-email?token=${token}`;

    const mailOptions = {
        from: `"FinanTech Dash" <${process.env.EMAIL_USER}>`, // Remetente
        to: to, // Destinatário
        subject: 'Confirme seu E-mail - FinanTech Dash',
        html: `
      <h1>Bem-vindo ao FinanTech Dash!</h1>
      <p>Obrigado por se registar. Por favor, clique no link abaixo para verificar seu e-mail e ativar sua conta:</p>
      <a href="${verificationLink}" target="_blank">Verificar Meu E-mail</a>
      <p>Se você não se registou, por favor ignore este e-mail.</p>
    `,
    };

    try {
        // 2. Usando o transportador para enviar o e-mail
        await transporter.sendMail(mailOptions);
        console.log(`✉️ E-mail de verificação enviado para ${to}`);
    } catch (error) {
        console.error("❌ Erro ao enviar e-mail de verificação com Nodemailer:", error);
        throw new Error('Falha ao enviar e-mail de verificação.');
    }
};

const frontendUrl = 'http://localhost:5173';

/**
 * Envia um e-mail de redefinição de senha para o utilizador.
 * @param to O e-mail do destinatário.
 * @param token O token de redefinição único.
 */
export const sendPasswordResetEmail = async (to: string, token: string) => {
    const resetLink = `${frontendUrl}/reset-password?token=${token}`;

    const mailOptions = {
        from: `"FinanTech Dash" <${process.env.EMAIL_USER}>`,
        to: to,
        subject: 'Redefinição de Senha - FinanTech Dash',
        html: `
      <h1>Redefinição de Senha</h1>
      <p>Recebemos um pedido para redefinir a sua senha. Se não foi você, por favor ignore este e-mail.</p>
      <p>Clique no link abaixo para criar uma nova senha. Este link é válido por 1 hora:</p>
      <a href="${resetLink}" target="_blank">Redefinir Minha Senha</a>
    `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`✉️ E-mail de redefinição de senha enviado para ${to}`);
    } catch (error) {
        console.error("❌ Erro ao enviar e-mail de redefinição:", error);
        throw new Error('Falha ao enviar e-mail de redefinição.');
    }
};