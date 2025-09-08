// src/pages/ForgotPassword.tsx
import { useState } from 'react';
import { TextField, Button, Typography, Box, Paper, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import api from '../services/api';
import { useSnackbar } from '../context/SnackbarContext';

export function ForgotPassword() {
    const [email, setEmail] = useState('');
    const { showSnackbar } = useSnackbar();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const response = await api.post('/auth/forgot-password', { email });
            showSnackbar(response.data.message, 'success');
        } catch (error) {
            showSnackbar('Ocorreu um erro. Tente novamente.', 'error');
            console.error(error);
        }
    };

    return (
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            backgroundColor: 'background.default'
        }}>
            <Paper elevation={0} sx={{ p: 4, width: '100%', maxWidth: 450, borderRadius: 3 }}>
                <Typography component="h1" variant="h4" fontWeight={700} gutterBottom>
                    Recuperar Senha
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 3 }}>
                    Insira o seu e-mail abaixo. Se ele estiver registado, enviaremos um link para redefinir a sua senha.
                </Typography>
                <Box component="form" onSubmit={handleSubmit}>
                    <TextField
                        margin="normal" required fullWidth id="email" label="Endereço de E-mail"
                        name="email" autoComplete="email" autoFocus value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2, py: 1.5 }}>
                        Enviar Link de Recuperação
                    </Button>
                    <Typography align="center" color="text.secondary">
                        Lembrou-se da sua senha?{' '}
                        <Link component={RouterLink} to="/login" fontWeight={600}>
                            Fazer Login
                        </Link>
                    </Typography>
                </Box>
            </Paper>
        </Box>
    );
}