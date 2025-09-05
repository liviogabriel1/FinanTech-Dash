// src/main.tsx
import React, { useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { getTheme } from './theme.ts';
import { ThemeToggleProvider, useThemeToggle } from './context/ThemeContext.tsx';
import { WalletProvider } from './context/WalletContext.tsx'; // 1. Importe o WalletProvider
import { SnackbarProvider } from './context/SnackbarContext.tsx';

import './index.css';

const AppWithProviders = () => {
  const { mode } = useThemeToggle();
  const theme = useMemo(() => getTheme(mode), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <WalletProvider>
          {/* 2. Adicione o SnackbarProvider aqui */}
          <SnackbarProvider>
            <App />
          </SnackbarProvider>
        </WalletProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeToggleProvider>
      <AppWithProviders />
    </ThemeToggleProvider>
  </React.StrictMode>
);