// src/components/ManageWalletsModal.tsx
import React, { useState } from 'react';
import { Modal, Box, Typography, Button, List, ListItem, ListItemText, IconButton, Divider } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../services/api';
import { useWallets } from '../context/WalletContext';
import { ConfirmationDialog } from './ConfirmationDialog';
import { useSnackbar } from '../context/SnackbarContext';

interface ManageWalletsModalProps {
    open: boolean;
    onClose: () => void;
}

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 450,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 3,
};

export const ManageWalletsModal: React.FC<ManageWalletsModalProps> = ({ open, onClose }) => {
    const { wallets, refreshWallets, selectedWallet } = useWallets();
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [walletToDelete, setWalletToDelete] = useState<string | null>(null);
    const { showSnackbar } = useSnackbar();

    const openConfirmation = (walletId: string) => {
        if (wallets.length <= 1) {
            alert('Você não pode excluir sua única carteira. Crie outra antes de excluir esta.');
            return;
        }
        setWalletToDelete(walletId);
        setConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!walletToDelete) return;
        try {
            await api.delete(`/wallets/${walletToDelete}`);
            showSnackbar('Carteira deletada com sucesso!', 'success'); // 3. Mensagem de sucesso
            refreshWallets();
        } catch (error) {
            showSnackbar('Erro ao excluir a carteira.', 'error'); // 4. Mensagem de erro
            console.error(error);
        } finally {
            setConfirmOpen(false);
            setWalletToDelete(null);
        }
    };

    return (
        <>
            <Modal open={open} onClose={onClose}>
                <Box sx={style}>
                    <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
                        Gerenciar Carteiras
                    </Typography>
                    <List>
                        {wallets.map((wallet) => (
                            <React.Fragment key={wallet.id}>
                                <ListItem
                                    secondaryAction={
                                        <IconButton edge="end" aria-label="delete" onClick={() => openConfirmation(wallet.id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    }
                                >
                                    <ListItemText primary={wallet.name} secondary={wallet.id === selectedWallet?.id ? 'Selecionada' : ''} />
                                </ListItem>
                                <Divider />
                            </React.Fragment>
                        ))}
                    </List>
                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button onClick={onClose}>Fechar</Button>
                    </Box>
                </Box>
            </Modal>

            <ConfirmationDialog
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Excluir Carteira?"
                message="Esta ação é irreversível. Todas as transações associadas a esta carteira serão perdidas permanentemente."
            />
        </>
    );
};