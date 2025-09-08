// src/components/WalletSelector.tsx
import React from 'react';
import { Box, Typography, Select, MenuItem, IconButton, Tooltip } from '@mui/material'; // Adiciona Tooltip
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SettingsIcon from '@mui/icons-material/Settings'; // Ícone de configurações
import { useWallets } from '../context/WalletContext';

interface WalletSelectorProps {
    onOpenCreateModal: () => void;
    onOpenManageModal: () => void; // Nova prop para o modal de gerenciamento
}

export const WalletSelector: React.FC<WalletSelectorProps> = ({ onOpenCreateModal, onOpenManageModal }) => {
    const { wallets, selectedWallet, selectWallet, loading } = useWallets();

    if (loading) {
        return <Typography sx={{ mr: 2 }}>Carregando carteiras...</Typography>;
    }

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', mr: 2, gap: 0.5 }}>
            {wallets.length > 0 && selectedWallet ? (
                <Select
                    value={selectedWallet.id}
                    onChange={(e) => selectWallet(e.target.value as string)}
                    variant="outlined"
                    size="small"
                    sx={{ minWidth: 150, '.MuiOutlinedInput-notchedOutline': { border: 0 }, fontWeight: 600 }}
                >
                    {wallets.map((wallet) => (
                        <MenuItem key={wallet.id} value={wallet.id}>{wallet.name}</MenuItem>
                    ))}
                </Select>
            ) : (
                <Typography sx={{ mr: 1 }}>Nenhuma carteira.</Typography>
            )}

            <Tooltip title="Criar nova carteira">
                <IconButton onClick={onOpenCreateModal} color="primary" size="small">
                    <AddCircleOutlineIcon />
                </IconButton>
            </Tooltip>

            {/* Ícone para abrir o modal de gerenciamento */}
            <Tooltip title="Gerenciar carteiras">
                <IconButton onClick={onOpenManageModal} size="small">
                    <SettingsIcon />
                </IconButton>
            </Tooltip>
        </Box>
    );
};