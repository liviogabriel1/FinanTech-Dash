// src/pages/PendingVerification.tsx
import { Box, Paper, Typography } from '@mui/material';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';

export function PendingVerification() {
    return (
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            backgroundColor: 'background.default'
        }}>
            <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 500, textAlign: 'center', borderRadius: 3 }}>
                <MarkEmailReadIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography component="h1" variant="h4" fontWeight={700} gutterBottom>
                    Registo Quase Concluído!
                </Typography>
                <Typography color="text.secondary">
                    Enviámos um link de verificação para o seu e-mail. Por favor, clique nesse link para ativar a sua conta e poder fazer o login.
                </Typography>
            </Paper>
        </Box>
    );
}