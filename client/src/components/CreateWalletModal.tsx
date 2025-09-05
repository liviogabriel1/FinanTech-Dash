// src/components/CreateWalletModal.tsx
import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';
import api from '../services/api';

interface CreateWalletModalProps {
    open: boolean;
    onClose: () => void;
    onWalletCreated: () => void;
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

export const CreateWalletModal: React.FC<CreateWalletModalProps> = ({ open, onClose, onWalletCreated }) => {
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!name.trim()) {
            setError('O nome é obrigatório.');
            return;
        }
        try {
            await api.post('/wallets', { name });
            onWalletCreated(); // Avisa o app para recarregar a lista de carteiras
            onClose(); // Fecha o modal
            setName(''); // Limpa o campo
        } catch (err) {
            setError('Erro ao criar a carteira.');
            console.error(err);
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={style} component="form" onSubmit={handleSubmit}>
                <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
                    Criar Nova Carteira
                </Typography>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Nome da Carteira"
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value);
                        setError('');
                    }}
                    error={!!error}
                    helperText={error}
                    autoFocus
                />
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    <Button onClick={onClose}>Cancelar</Button>
                    <Button type="submit" variant="contained">Salvar</Button>
                </Box>
            </Box>
        </Modal>
    );
};