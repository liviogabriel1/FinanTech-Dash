import { useState, useEffect } from 'react';
import { TextField, Button, Typography, Box, Paper } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { useSnackbar } from '../context/SnackbarContext';
import { PasswordStrengthMeter } from '../components/PasswordStrengthMeter';

export function ResetPassword() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [searchParams] = useSearchParams();
    const [token, setToken] = useState<string | null>(null);
    const { showSnackbar } = useSnackbar();
    const navigate = useNavigate();

    useEffect(() => {
        const resetToken = searchParams.get('token');
        if (resetToken) {
            setToken(resetToken);
        } else {
            showSnackbar('Token de redefinição inválido ou ausente.', 'error');
            navigate('/login');
        }
    }, [searchParams, navigate, showSnackbar]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (password !== confirmPassword) {
            showSnackbar('As senhas não coincidem.', 'error');
            return;
        }
        if (!token) {
            showSnackbar('Token não encontrado.', 'error');
            return;
        }

        try {
            const response = await api.post('/auth/reset-password', { token, password });
            showSnackbar(response.data.message, 'success');
            navigate('/login');
        } catch (error: any) {
            const message = error.response?.data?.message || 'Erro ao redefinir a senha.';
            showSnackbar(message, 'error');
        }
    };

    return (
        <Box sx={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            height: '100vh', backgroundColor: 'background.default'
        }}>
            <Paper elevation={0} sx={{ p: 4, width: '100%', maxWidth: 450, borderRadius: 3 }}>
                <Typography component="h1" variant="h4" fontWeight={700} gutterBottom>
                    Crie uma Nova Senha
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 3 }}>
                    Por favor, insira a sua nova senha abaixo.
                </Typography>
                <Box component="form" onSubmit={handleSubmit}>
                    <TextField
                        margin="normal" required fullWidth name="password" label="Nova Senha"
                        type="password" id="password" value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <TextField
                        margin="normal" required fullWidth name="confirmPassword" label="Confirmar Nova Senha"
                        type="password" id="confirmPassword" value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />

                    <PasswordStrengthMeter password={password} />

                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2, py: 1.5 }}>
                        Redefinir Senha
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
}