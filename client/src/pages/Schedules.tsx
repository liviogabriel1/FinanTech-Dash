// src/pages/Schedules.tsx
import { useEffect, useState } from 'react';
import { Box, Button, Container, List, ListItem, ListItemText, Typography, IconButton, Paper, CircularProgress } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useWallets } from '../context/WalletContext';
import api from '../services/api';
import { ScheduleTransactionModal } from '../components/ScheduleTransactionModal';
import { ConfirmationDialog } from '../components/ConfirmationDialog';

interface Schedule {
    id: string;
    title: string;
    amount: number;
    category: string;
    frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY';
    nextRunDate: string;
    type: 'INCOME' | 'EXPENSE';
}

export function Schedules() {
    const { selectedWallet } = useWallets();

    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [scheduleToDelete, setScheduleToDelete] = useState<string | null>(null);

    const fetchSchedules = async () => {
        if (!selectedWallet) {
            setSchedules([]);
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            const response = await api.get(`/schedules/wallet/${selectedWallet.id}`);
            setSchedules(response.data);
        } catch (error) {
            console.error("Erro ao buscar agendamentos:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSchedules();
    }, [selectedWallet]);

    const handleDelete = (id: string) => {
        setScheduleToDelete(id);
        setConfirmDeleteOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!scheduleToDelete) return;
        try {
            await api.delete(`/schedules/${scheduleToDelete}`);
            fetchSchedules();
        } catch (error) {
            alert('Falha ao deletar agendamento.');
        } finally {
            setConfirmDeleteOpen(false);
            setScheduleToDelete(null);
        }
    };

    return (
        <>
            <ScheduleTransactionModal open={modalOpen} onClose={() => setModalOpen(false)} onScheduleCreated={fetchSchedules} />
            <ConfirmationDialog open={confirmDeleteOpen} onClose={() => setConfirmDeleteOpen(false)} onConfirm={handleConfirmDelete} title="Excluir Agendamento?" message="Tem certeza que deseja excluir esta regra de agendamento? Esta ação não pode ser desfeita." />

            <Container maxWidth="md">
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>Transações Agendadas</Typography>
                    <Button variant="contained" onClick={() => setModalOpen(true)} disabled={!selectedWallet}>
                        Novo Agendamento
                    </Button>
                </Box>
                <Paper>
                    {loading ? (
                        <Box sx={{ p: 4, textAlign: 'center' }}><CircularProgress /></Box>
                    ) : schedules.length > 0 ? (
                        <List>
                            {schedules.map(schedule => (
                                <ListItem key={schedule.id} secondaryAction={<IconButton edge="end" onClick={() => handleDelete(schedule.id)}><DeleteIcon /></IconButton>}>
                                    <ListItemText
                                        primary={schedule.title}
                                        secondary={`Próxima execução: ${new Date(schedule.nextRunDate).toLocaleDateString()}`}
                                    />
                                    <Typography color={schedule.type === 'INCOME' ? 'success.main' : 'error.main'} sx={{ fontWeight: 600 }}>
                                        {schedule.type === 'INCOME' ? '+' : '-'} R$ {schedule.amount.toFixed(2)} ({schedule.frequency.charAt(0) + schedule.frequency.slice(1).toLowerCase()})
                                    </Typography>
                                </ListItem>
                            ))}
                        </List>
                    ) : (
                        <Typography sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
                            {selectedWallet ? `Nenhuma transação agendada para a carteira "${selectedWallet.name}".` : 'Selecione uma carteira para ver os agendamentos.'}
                        </Typography>
                    )}
                </Paper>
            </Container>
        </>
    );
}