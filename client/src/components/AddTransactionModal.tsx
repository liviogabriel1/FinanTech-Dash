// src/components/AddTransactionModal.tsx
import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import api from '../services/api';
import { useWallets } from '../context/WalletContext';
import { useSnackbar } from '../context/SnackbarContext';

interface Transaction {
    id: string;
    title: string;
    amount: number;
    category: string;
    date: string;
    type: 'INCOME' | 'EXPENSE';
}

interface AddTransactionModalProps {
    open: boolean;
    onClose: () => void;
    onTransactionUpdated: () => void;
    transactionToEdit?: Transaction | null;
}

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 3,
};

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({ open, onClose, onTransactionUpdated, transactionToEdit }) => {
    const { showSnackbar } = useSnackbar();
    const { selectedWallet } = useWallets();
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [date, setDate] = useState('');
    const [type, setType] = useState<'INCOME' | 'EXPENSE'>('EXPENSE');

    const isEditMode = !!transactionToEdit;

    useEffect(() => {
        if (isEditMode && transactionToEdit) {
            setTitle(transactionToEdit.title);
            setAmount(String(transactionToEdit.amount));
            setCategory(transactionToEdit.category);
            setDate(new Date(transactionToEdit.date).toISOString().split('T')[0]);
            setType(transactionToEdit.type);
        } else {
            setTitle('');
            setAmount('');
            setCategory('');
            setDate(new Date().toISOString().split('T')[0]);
            setType('EXPENSE');
        }
    }, [transactionToEdit, open]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        // Verificação de segurança: não faz nada se não houver uma carteira selecionada
        if (!selectedWallet) {
            console.error("Nenhuma carteira selecionada para adicionar a transação.");
            return;
        }

        const transactionData = {
            title,
            amount,
            category,
            date,
            type,
            walletId: selectedWallet.id
        };

        try {
            if (isEditMode && transactionToEdit) {
                await api.put(`/wallets/transactions/${transactionToEdit.id}`, transactionData);
                showSnackbar('Transação atualizada com sucesso!', 'success'); // 3. Sucesso
            } else {
                await api.post('/wallets/transactions', transactionData);
                showSnackbar('Transação criada com sucesso!', 'success'); // 3. Sucesso
            }
            onTransactionUpdated();
            onClose();
        } catch (error) {
            console.error('Erro ao salvar transação', error);
            showSnackbar('Erro ao salvar transação.', 'error'); // 4. Erro
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={style} component="form" onSubmit={handleSubmit}>
                <Typography variant="h6" component="h2">
                    {isEditMode ? 'Editar Transação' : `Nova Transação em "${selectedWallet?.name}"`}
                </Typography>
                <TextField margin="normal" required fullWidth label="Título" value={title} onChange={e => setTitle(e.target.value)} />
                <TextField margin="normal" required fullWidth label="Valor" type="number" value={amount} onChange={e => setAmount(e.target.value)} />
                <TextField margin="normal" required fullWidth label="Categoria" value={category} onChange={e => setCategory(e.target.value)} />
                <TextField margin="normal" required fullWidth label="Data" type="date" value={date} onChange={e => setDate(e.target.value)} InputLabelProps={{ shrink: true }} />
                <FormControl fullWidth margin="normal">
                    <InputLabel>Tipo</InputLabel>
                    <Select value={type} label="Tipo" onChange={e => setType(e.target.value as any)}>
                        <MenuItem value="EXPENSE">Despesa</MenuItem>
                        <MenuItem value="INCOME">Receita</MenuItem>
                    </Select>
                </FormControl>
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    <Button onClick={onClose}>Cancelar</Button>
                    <Button type="submit" variant="contained">Salvar</Button>
                </Box>
            </Box>
        </Modal>
    );
};