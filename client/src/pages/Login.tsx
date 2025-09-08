// src/pages/Login.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { TextField, Button, Typography, Box, Paper, Link } from '@mui/material';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [welcomeMessage, setWelcomeMessage] = useState('Bem-vindo!');
    const navigate = useNavigate();
    const { login } = useAuth();

    useEffect(() => {
        const hasVisited = localStorage.getItem('hasVisited');
        if (hasVisited) {
            setWelcomeMessage('Bem-vindo de volta!');
        }
    }, []);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError('');
        try {
            const response = await api.post('/auth/login', { email, password });
            const { token, user } = response.data;
            login(token, user);
            navigate('/dashboard');
        } catch (err: any) {
            const message = err.response?.data?.message || 'Erro ao fazer login. Verifique as suas credenciais.';
            setError(message);
        }
    };

    return (
        <Box sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            height: '100vh',
            backgroundColor: 'background.default'
        }}>
            {/* Lado Esquerdo - Branding */}
            <Box sx={{
                display: { xs: 'none', md: 'flex' },
                alignItems: 'center',
                justifyContent: 'center',
                background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                color: 'white',
                p: 4
            }}>
                <Box textAlign="center">
                    <Typography variant="h2" fontWeight={700}>FinanTech Dash</Typography>
                    <Typography variant="h6">Seu painel financeiro, simplificado.</Typography>
                </Box>
            </Box>

            {/* Lado Direito - Formulário */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 4 }}>
                <Paper elevation={0} sx={{ p: 4, width: '100%', maxWidth: 400, borderRadius: 3 }}>
                    <Typography component="h1" variant="h4" fontWeight={700} gutterBottom>
                        {welcomeMessage}
                    </Typography>
                    <Typography color="text.secondary" sx={{ mb: 3 }}>
                        Faça login para aceder ao seu dashboard.
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit}>
                        <TextField
                            margin="normal" required fullWidth id="email" label="Endereço de E-mail"
                            name="email" autoComplete="email" autoFocus value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <TextField
                            margin="normal" required fullWidth name="password" label="Senha"
                            type="password" id="password" autoComplete="current-password"
                            value={password} onChange={(e) => setPassword(e.target.value)}
                        />
                        {error && (
                            <Typography color="error" variant="body2" sx={{ mt: 2 }}>
                                {error}
                            </Typography>
                        )}
                        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2, py: 1.5 }}>
                            Entrar
                        </Button>

                        {/* Links de rodapé com novo layout */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                            <Typography color="text.secondary">
                                Não tem uma conta?{' '}
                                <Link component={RouterLink} to="/register" fontWeight={600}>
                                    Registre-se
                                </Link>
                            </Typography>
                            <Link component={RouterLink} to="/forgot-password" variant="body2">
                                Esqueceu a senha?
                            </Link>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Box>
    );
}