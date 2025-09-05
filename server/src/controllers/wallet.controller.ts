// server/src/controllers/wallet.controller.ts
import type { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import type { AuthRequest } from '../middleware/auth.middleware.js';

const prisma = new PrismaClient();

// Criar uma nova carteira
export const createWallet = async (req: AuthRequest, res: Response) => {
    const { name } = req.body;
    const userId = req.userId;

    if (!name) {
        return res.status(400).json({ message: 'O nome da carteira é obrigatório.' });
    }
    if (!userId) {
        return res.status(401).json({ message: 'Usuário não autenticado.' });
    }

    try {
        const wallet = await prisma.wallet.create({
            data: { name, userId },
        });
        res.status(201).json(wallet);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar a carteira.', error });
    }
};

// Obter todas as carteiras do usuário logado
export const getWallets = async (req: AuthRequest, res: Response) => {
    const userId = req.userId;

    if (!userId) {
        return res.status(401).json({ message: 'Usuário não autenticado.' });
    }

    try {
        const wallets = await prisma.wallet.findMany({
            where: { userId },
            orderBy: { createdAt: 'asc' },
        });
        res.json(wallets);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar as carteiras.', error });
    }
};

export const deleteWallet = async (req: AuthRequest, res: Response) => {
    const { walletId } = req.params; // Pega o ID da carteira pela URL
    const userId = req.userId!;

    try {
        // 1. Busca a carteira para garantir que ela existe
        const wallet = await prisma.wallet.findUnique({
            where: { id: walletId },
        });

        // 2. Validação de segurança CRUCIAL: a carteira pertence ao usuário logado?
        if (!wallet || wallet.userId !== userId) {
            return res.status(403).json({ message: 'Acesso negado. Você não tem permissão para deletar esta carteira.' });
        }

        // 3. Se a validação passar, deleta a carteira.
        // Graças ao "onDelete: Cascade" no nosso schema, o Prisma também deletará
        // todas as transações associadas a esta carteira automaticamente.
        await prisma.wallet.delete({
            where: { id: walletId },
        });

        res.status(204).send(); // Resposta de sucesso sem conteúdo
    } catch (error) {
        res.status(500).json({ message: 'Erro ao deletar a carteira.', error });
    }
};

export const getWalletSummary = async (req: AuthRequest, res: Response) => {
    const userId = req.userId!;
    const { walletId } = req.params;

    // Validação de segurança
    const wallet = await prisma.wallet.findUnique({ where: { id: walletId } });
    if (!wallet || wallet.userId !== userId) {
        return res.status(403).json({ message: 'Acesso negado à carteira.' });
    }

    try {
        // Usamos Promise.all para executar todas as consultas ao banco em paralelo,
        // o que é muito mais eficiente.
        const [totalIncome, totalExpense, expensesByCategory, incomesByCategory] = await Promise.all([
            prisma.transaction.aggregate({
                _sum: { amount: true },
                where: { walletId, type: 'INCOME' },
            }),
            prisma.transaction.aggregate({
                _sum: { amount: true },
                where: { walletId, type: 'EXPENSE' },
            }),
            prisma.transaction.groupBy({
                by: ['category'],
                _sum: { amount: true },
                where: { walletId, type: 'EXPENSE' },
            }),
            // NOVA CONSULTA: Agrupando as receitas por categoria
            prisma.transaction.groupBy({
                by: ['category'],
                _sum: { amount: true },
                where: { walletId, type: 'INCOME' },
            }),
        ]);

        const incomeSum = totalIncome._sum.amount || 0;
        const expenseSum = totalExpense._sum.amount || 0;

        res.json({
            totalIncome: incomeSum,
            totalExpense: expenseSum,
            balance: incomeSum - expenseSum,
            expensesByCategory: expensesByCategory.map(item => ({
                name: item.category,
                value: item._sum.amount || 0,
            })),
            // NOVO DADO: Adicionando as receitas por categoria à resposta
            incomesByCategory: incomesByCategory.map(item => ({
                name: item.category,
                value: item._sum.amount || 0,
            })),
        });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar o resumo da carteira.', error });
    }
};