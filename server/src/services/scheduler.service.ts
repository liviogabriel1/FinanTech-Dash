// src/services/scheduler.service.ts
import cron from 'node-cron';
import { PrismaClient, Recurrence } from '@prisma/client';
import { addDays, addMonths, addWeeks } from 'date-fns';

const prisma = new PrismaClient();

const calculateNextRunDate = (currentDate: Date, frequency: Recurrence): Date => {
    switch (frequency) {
        case 'DAILY':
            return addDays(currentDate, 1);
        case 'WEEKLY':
            return addWeeks(currentDate, 1);
        case 'MONTHLY':
            return addMonths(currentDate, 1);
        default:
            return addDays(currentDate, 1);
    }
};

const processScheduledTransactions = async () => {
    console.log('🤖 Verificando agendamentos pendentes...', new Date().toISOString());

    const now = new Date();
    const dueScheduledTransactions = await prisma.scheduledTransaction.findMany({
        where: {
            nextRunDate: {
                lte: now,
            },
        },
    });

    if (dueScheduledTransactions.length === 0) {
        console.log('✅ Nenhum agendamento para hoje.');
        return;
    }

    console.log(`🔍 Encontrados ${dueScheduledTransactions.length} agendamentos para processar.`);

    for (const scheduledTx of dueScheduledTransactions) {
        try {
            await prisma.transaction.create({
                data: {
                    title: scheduledTx.title,
                    amount: scheduledTx.amount,
                    category: scheduledTx.category,
                    type: scheduledTx.type,
                    date: scheduledTx.nextRunDate,
                    walletId: scheduledTx.walletId,
                    userId: scheduledTx.userId,
                },
            });

            const nextRunDate = calculateNextRunDate(scheduledTx.nextRunDate, scheduledTx.frequency);

            await prisma.scheduledTransaction.update({
                where: { id: scheduledTx.id },
                data: { nextRunDate: nextRunDate },
            });

            console.log(`✔️ Transação "${scheduledTx.title}" criada e agendamento atualizado.`);
        } catch (error) {
            console.error(`❌ Erro ao processar o agendamento ${scheduledTx.id}:`, error);
        }
    }
};

export const startScheduler = () => {
    // A expressão '0 1 * * *' significa: "Execute à 1:00 da manhã, todos os dias."
    cron.schedule('0 1 * * *', processScheduledTransactions, {
        // A opção 'scheduled: true' foi removida, pois é o comportamento padrão.
        timezone: "America/Sao_Paulo"
    });

    console.log('⏰ Agendador de transações iniciado. O robô irá rodar à 1h da manhã.');
};