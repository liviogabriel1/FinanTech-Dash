// server/src/controllers/schedule.controller.ts
import type { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import type { AuthRequest } from '../middleware/auth.middleware.js';

const prisma = new PrismaClient();

// Criar um novo agendamento
export const createSchedule = async (req: AuthRequest, res: Response) => {
    const userId = req.userId!;
    const { title, amount, category, type, frequency, startDate, dayOfMonth, dayOfWeek, walletId } = req.body;

    // Validação de segurança: o usuário é o dono da carteira?
    const wallet = await prisma.wallet.findUnique({ where: { id: walletId } });
    if (!wallet || wallet.userId !== userId) {
        return res.status(403).json({ message: 'Acesso negado à carteira.' });
    }

    try {
        const schedule = await prisma.scheduledTransaction.create({
            data: {
                title,
                amount: parseFloat(amount),
                category,
                type,
                frequency,
                startDate: new Date(startDate),
                // O nextRunDate inicial é a própria data de início
                nextRunDate: new Date(startDate),
                dayOfMonth: dayOfMonth ? parseInt(dayOfMonth) : null,
                dayOfWeek: dayOfWeek ? parseInt(dayOfWeek) : null,
                walletId,
                userId,
            },
        });
        res.status(201).json(schedule);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar agendamento.', error });
    }
};

// Listar todos os agendamentos de uma carteira
export const getSchedulesByWallet = async (req: AuthRequest, res: Response) => {
    const userId = req.userId!;
    const { walletId } = req.params;

    // Validação de segurança
    const wallet = await prisma.wallet.findUnique({ where: { id: walletId } });
    if (!wallet || wallet.userId !== userId) {
        return res.status(403).json({ message: 'Acesso negado à carteira.' });
    }

    try {
        const schedules = await prisma.scheduledTransaction.findMany({
            where: { walletId },
            orderBy: { nextRunDate: 'asc' },
        });
        res.json(schedules);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao listar agendamentos.', error });
    }
};

// Deletar um agendamento
export const deleteSchedule = async (req: AuthRequest, res: Response) => {
    const userId = req.userId!;
    const { scheduleId } = req.params;

    try {
        const schedule = await prisma.scheduledTransaction.findUnique({ where: { id: scheduleId } });
        if (!schedule || schedule.userId !== userId) {
            return res.status(403).json({ message: 'Acesso negado.' });
        }

        await prisma.scheduledTransaction.delete({ where: { id: scheduleId } });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Erro ao deletar agendamento.', error });
    }
};