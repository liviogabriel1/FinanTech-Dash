// server/src/controllers/transaction.controller.ts
import type { Response } from 'express';
import { PrismaClient, TransactionType } from '@prisma/client';
import type { AuthRequest } from '../middleware/auth.middleware.js';

const prisma = new PrismaClient();

// Criar uma nova transação DENTRO de uma carteira
export const createTransaction = async (req: AuthRequest, res: Response) => {
    const { title, amount, category, date, type, walletId } = req.body;
    const userId = req.userId!;

    // Validação crucial: A carteira fornecida pertence ao usuário logado?
    const wallet = await prisma.wallet.findUnique({ where: { id: walletId } });
    if (!wallet || wallet.userId !== userId) {
        return res.status(403).json({ message: 'Acesso negado à carteira.' });
    }

    const transaction = await prisma.transaction.create({
        data: {
            title,
            amount: parseFloat(amount),
            category,
            date: new Date(date),
            type: type === 'INCOME' ? TransactionType.INCOME : TransactionType.EXPENSE,
            walletId,
            userId, // Incluímos o userId para redundância de segurança e facilidade de consulta
        },
    });
    res.status(201).json(transaction);
};

// Obter todas as transações de UMA carteira específica
export const getTransactionsByWallet = async (req: AuthRequest, res: Response) => {
    const userId = req.userId!;
    const { walletId } = req.params;

    // 1. Pegar 'page' e 'limit' da query string (com valores padrão)
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 5; // Mostraremos 5 transações por página
    const skip = (page - 1) * limit; // Calcula quantos registros pular

    // Validação de segurança
    const wallet = await prisma.wallet.findUnique({ where: { id: walletId } });
    if (!wallet || wallet.userId !== userId) {
        return res.status(403).json({ message: 'Acesso negado à carteira.' });
    }

    try {
        // 2. Fazemos duas chamadas ao banco: uma para os dados e outra para a contagem total
        const [transactions, totalTransactions] = await prisma.$transaction([
            prisma.transaction.findMany({
                where: { walletId },
                orderBy: { date: 'desc' },
                skip: skip,
                take: limit,
            }),
            prisma.transaction.count({ where: { walletId } }),
        ]);

        // 3. Montamos a resposta com os dados e a informação da paginação
        res.json({
            transactions,
            totalPages: Math.ceil(totalTransactions / limit),
            currentPage: page,
        });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar transações paginadas.', error });
    }
};

// Atualizar uma transação
export const updateTransaction = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const userId = req.userId!;
    const { title, amount, category, date, type } = req.body;

    const originalTransaction = await prisma.transaction.findUnique({ where: { id } });
    if (!originalTransaction || originalTransaction.userId !== userId) {
        return res.status(403).json({ message: 'Acesso negado.' });
    }

    const updatedTransaction = await prisma.transaction.update({
        where: { id },
        data: { title, amount: parseFloat(amount), category, date: new Date(date), type },
    });
    res.json(updatedTransaction);
};

// Deletar uma transação
export const deleteTransaction = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const userId = req.userId!;

    const transaction = await prisma.transaction.findUnique({ where: { id } });
    if (!transaction || transaction.userId !== userId) {
        return res.status(403).json({ message: 'Acesso negado.' });
    }

    await prisma.transaction.delete({ where: { id } });
    res.status(204).send();
};