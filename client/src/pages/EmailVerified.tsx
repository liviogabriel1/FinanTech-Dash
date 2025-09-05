// src/pages/EmailVerified.tsx
import { Box, Paper, Typography, Button } from '@mui/material';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import { Link as RouterLink } from 'react-router-dom';

export function EmailVerified() {
    return (
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            backgroundColor: 'background.default'
        }}>
            <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 500, textAlign: 'center', borderRadius: 3 }}>
                <VerifiedUserIcon sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
                <Typography component="h1" variant="h4" fontWeight={700} gutterBottom>
                    E-mail Verificado com Sucesso!
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 3 }}>
                    A sua conta foi ativada. Agora você já pode entrar no seu dashboard.
                </Typography>
                <Button
                    component={RouterLink}
                    to="/login"
                    variant="contained"
                    size="large"
                >
                    Ir para o Login
                </Button>
            </Paper>
        </Box>
    );
}