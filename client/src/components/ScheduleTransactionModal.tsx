// src/components/ScheduleTransactionModal.tsx
import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import api from '../services/api';
import { useWallets } from '../context/WalletContext';
import { useSnackbar } from '../context/SnackbarContext';

interface ScheduleTransactionModalProps {
    open: boolean;
    onClose: () => void;
    onScheduleCreated: () => void;
}

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 3,
};

const daysOfMonth = Array.from({ length: 31 }, (_, i) => i + 1);

export const ScheduleTransactionModal: React.FC<ScheduleTransactionModalProps> = ({ open, onClose, onScheduleCreated }) => {
    const { selectedWallet } = useWallets();

    const { showSnackbar } = useSnackbar();
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [type, setType] = useState<'INCOME' | 'EXPENSE'>('EXPENSE');
    const [frequency, setFrequency] = useState<'DAILY' | 'WEEKLY' | 'MONTHLY'>('MONTHLY');
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [dayOfMonth, setDayOfMonth] = useState<number>(1);
    const [dayOfWeek, setDayOfWeek] = useState<number>(0);

    const resetForm = () => {
        setTitle(''); setAmount(''); setCategory(''); setType('EXPENSE');
        setFrequency('MONTHLY'); setStartDate(new Date().toISOString().split('T')[0]);
        setDayOfMonth(1); setDayOfWeek(0);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!selectedWallet) return;

        const scheduleData = {
            title, amount, category, type, frequency, startDate,
            dayOfMonth: frequency === 'MONTHLY' ? dayOfMonth : null,
            dayOfWeek: frequency === 'WEEKLY' ? dayOfWeek : null,
            walletId: selectedWallet.id,
        };

        try {
            await api.post('/schedules', scheduleData);
            showSnackbar('Transação agendada com sucesso!', 'success'); // 3. Sucesso
            onScheduleCreated();
            onClose();
        } catch (error) {
            console.error("Erro ao criar agendamento:", error);
            showSnackbar('Falha ao criar agendamento.', 'error'); // 4. Erro
        }
    };

    useEffect(() => {
        if (!open) {
            setTimeout(resetForm, 300);
        }
    }, [open]);

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={style} component="form" onSubmit={handleSubmit}>
                <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
                    Agendar Nova Transação
                </Typography>

                {/* Layout refeito com Box e CSS Grid */}
                <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={2}>
                    <Box gridColumn="span 12"><TextField required fullWidth label="Título" value={title} onChange={e => setTitle(e.target.value)} /></Box>
                    <Box gridColumn="span 6"><TextField required fullWidth label="Valor" type="number" value={amount} onChange={e => setAmount(e.target.value)} /></Box>
                    <Box gridColumn="span 6"><TextField required fullWidth label="Categoria" value={category} onChange={e => setCategory(e.target.value)} /></Box>
                    <Box gridColumn="span 12"><FormControl fullWidth><InputLabel>Tipo</InputLabel><Select value={type} label="Tipo" onChange={e => setType(e.target.value as any)}><MenuItem value="EXPENSE">Despesa</MenuItem><MenuItem value="INCOME">Receita</MenuItem></Select></FormControl></Box>
                    <Box gridColumn="span 12"><TextField required fullWidth label="Data de Início" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} InputLabelProps={{ shrink: true }} /></Box>
                    <Box gridColumn="span 12"><FormControl fullWidth><InputLabel>Frequência</InputLabel><Select value={frequency} label="Frequência" onChange={e => setFrequency(e.target.value as any)}><MenuItem value="DAILY">Diário</MenuItem><MenuItem value="WEEKLY">Semanal</MenuItem><MenuItem value="MONTHLY">Mensal</MenuItem></Select></FormControl></Box>

                    {frequency === 'WEEKLY' && (
                        <Box gridColumn="span 12"><FormControl fullWidth><InputLabel>Dia da Semana</InputLabel><Select value={dayOfWeek} label="Dia da Semana" onChange={e => setDayOfWeek(Number(e.target.value))}><MenuItem value={0}>Domingo</MenuItem><MenuItem value={1}>Segunda</MenuItem><MenuItem value={2}>Terça</MenuItem><MenuItem value={3}>Quarta</MenuItem><MenuItem value={4}>Quinta</MenuItem><MenuItem value={5}>Sexta</MenuItem><MenuItem value={6}>Sábado</MenuItem></Select></FormControl></Box>
                    )}
                    {frequency === 'MONTHLY' && (
                        <Box gridColumn="span 12"><FormControl fullWidth><InputLabel>Dia do Mês</InputLabel><Select value={dayOfMonth} label="Dia do Mês" onChange={e => setDayOfMonth(Number(e.target.value))}>{daysOfMonth.map(day => (<MenuItem key={day} value={day}>{day}</MenuItem>))}</Select></FormControl></Box>
                    )}
                </Box>

                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    <Button onClick={onClose}>Cancelar</Button>
                    <Button type="submit" variant="contained">Agendar</Button>
                </Box>
            </Box>
        </Modal>
    );
};