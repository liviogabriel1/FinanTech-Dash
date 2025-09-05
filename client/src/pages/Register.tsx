// src/pages/Register.tsx
import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { TextField, Button, Typography, Box, Paper, Link } from '@mui/material';
import api from '../services/api';

export function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError('');
        try {
            // A API agora retorna apenas uma mensagem de sucesso, não faz login
            await api.post('/auth/register', { name, email, password });

            // MUDANÇA CRUCIAL: Redireciona para a página de verificação pendente
            navigate('/pending-verification');

        } catch (err: any) {
            const message = err.response?.data?.message || 'Erro ao registar. Tente novamente.';
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
                        Crie sua conta
                    </Typography>
                    <Typography color="text.secondary" sx={{ mb: 3 }}>
                        Comece a organizar suas finanças hoje mesmo.
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit}>
                        <TextField
                            margin="normal" required fullWidth id="name" label="Nome Completo"
                            name="name" autoFocus value={name} onChange={(e) => setName(e.target.value)}
                        />
                        <TextField
                            margin="normal" required fullWidth id="email" label="Endereço de E-mail"
                            name="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)}
                        />
                        <TextField
                            margin="normal" required fullWidth name="password" label="Senha"
                            type="password" id="password" autoComplete="new-password"
                            value={password} onChange={(e) => setPassword(e.target.value)}
                        />
                        {error && (
                            <Typography color="error" variant="body2" sx={{ mt: 2 }}>{error}</Typography>
                        )}
                        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2, py: 1.5 }}>
                            Cadastrar
                        </Button>
                        <Typography align="center" color="text.secondary">
                            Já tem uma conta?{' '}
                            <Link component={RouterLink} to="/login" fontWeight={600}>
                                Faça login
                            </Link>
                        </Typography>
                    </Box>
                </Paper>
            </Box>
        </Box>
    );
}