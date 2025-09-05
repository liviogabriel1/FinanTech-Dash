// src/layouts/MainLayout.tsx
import { Box, AppBar, Toolbar, Typography, IconButton, Button } from '@mui/material';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useThemeToggle } from '../context/ThemeContext';
import { WalletSelector } from '../components/WalletSelector';
import { ManageWalletsModal } from '../components/ManageWalletsModal';
import { CreateWalletModal } from '../components/CreateWalletModal';
import { useState } from 'react';
import { useWallets } from '../context/WalletContext';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const activeLinkStyle = {
    backgroundColor: 'action.hover',
    fontWeight: 700,
};

export function MainLayout() {
    const { user, logout } = useAuth();
    const { mode, toggleTheme } = useThemeToggle();
    const { refreshWallets } = useWallets();
    const [createWalletModalOpen, setCreateWalletModalOpen] = useState(false);
    const [manageWalletsModalOpen, setManageWalletsModalOpen] = useState(false);

    return (
        <Box sx={{ display: 'flex' }}>
            <CreateWalletModal open={createWalletModalOpen} onClose={() => setCreateWalletModalOpen(false)} onWalletCreated={refreshWallets} />
            <ManageWalletsModal open={manageWalletsModalOpen} onClose={() => setManageWalletsModalOpen(false)} />

            <AppBar position="fixed" elevation={0}>
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <QueryStatsIcon sx={{ color: 'primary.main' }} />
                            <Typography variant="h6" sx={{ fontWeight: 700, display: { xs: 'none', md: 'block' } }}>
                                FinanTech Dash
                            </Typography>
                        </Box>
                        <WalletSelector onOpenCreateModal={() => setCreateWalletModalOpen(true)} onOpenManageModal={() => setManageWalletsModalOpen(true)} />
                        <Button component={NavLink} to="/dashboard" sx={{ my: 2, display: 'block', '&.active': activeLinkStyle }}>Dashboard</Button>
                        <Button component={NavLink} to="/schedules" sx={{ my: 2, display: 'block', '&.active': activeLinkStyle }}>Agendamentos</Button>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton sx={{ mr: 2 }} onClick={toggleTheme} color="inherit">{mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}</IconButton>
                        <Typography sx={{ display: { xs: 'none', sm: 'block' }, mr: 2 }}>Olá, {user?.name}!</Typography>
                        <Button variant="outlined" color="error" onClick={logout}>Sair</Button>
                    </Box>
                </Toolbar>
            </AppBar>

            <Box component="main" sx={{ flexGrow: 1, p: 3, mt: '64px' }}>
                <Outlet />
            </Box>
        </Box>
    );
}