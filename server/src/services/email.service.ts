import * as SibApiV3Sdk from '@sendinblue/client';

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

// A FORMA CORRETA E MODERNA DE AUTENTICAR
apiInstance.setApiKey(SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY!);

const backendUrl = process.env.RAILWAY_STATIC_URL 
    ? `https://` + process.env.RAILWAY_STATIC_URL 
    : 'http://localhost:3333';
    
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

// IMPORTANTE: Coloque aqui o e-mail que você verificou como remetente na Brevo
const senderEmail = 'liviogabriel6@gmail.com'; 

export const sendVerificationEmail = async (to: string, token: string) => {
  const verificationLink = `${backendUrl}/api/auth/verify-email?token=${token}`;
  
  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
  sendSmtpEmail.to = [{ email: to }];
  sendSmtpEmail.sender = { name: 'FinanTech Dash', email: senderEmail };
  sendSmtpEmail.subject = 'Confirme seu E-mail - FinanTech Dash';
  sendSmtpEmail.htmlContent = `<h1>Bem-vindo!</h1><p>Clique no link para verificar seu e-mail: <a href="${verificationLink}">Verificar</a></p>`;

  try {
    await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log(`✉️ E-mail de verificação enviado para ${to} via Brevo.`);
  } catch (error) {
    console.error("❌ Erro ao enviar e-mail com Brevo:", error);
    throw new Error('Falha ao enviar e-mail de verificação.');
  }
};

export const sendPasswordResetEmail = async (to: string, token: string) => {
  const resetLink = `${frontendUrl}/reset-password?token=${token}`;

  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
  sendSmtpEmail.to = [{ email: to }];
  sendSmtpEmail.sender = { name: 'FinanTech Dash', email: senderEmail };
  sendSmtpEmail.subject = 'Redefinição de Senha - FinanTech Dash';
  sendSmtpEmail.htmlContent = `<h1>Redefinição de Senha</h1><p>Clique no link para redefinir sua senha: <a href="${resetLink}">Redefinir Senha</a></p>`;
  
  try {
    await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log(`✉️ E-mail de redefinição enviado para ${to} via Brevo.`);
  } catch (error) {
    console.error("❌ Erro ao enviar e-mail de redefinição com Brevo:", error);
    throw new Error('Falha ao enviar e-mail de redefinição.');
  }
};