// server/src/middleware/auth.middleware.ts
import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'seu-segredo-super-secreto-para-desenvolvimento';

// Estendemos a interface Request do Express para incluir nossa propriedade `userId`
export interface AuthRequest extends Request {
    userId?: string;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Acesso negado. Nenhum token fornecido.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
        req.userId = decoded.userId; // Adiciona o ID do usuário ao objeto da requisição
        next(); // Passa para o próximo handler (o controller)
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido.' });
    }
};