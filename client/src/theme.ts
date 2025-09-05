// src/theme.ts
import { createTheme } from '@mui/material/styles';
import type { ThemeOptions } from '@mui/material/styles';

const lightPalette = {
    primary: { main: '#7E57C2' },
    background: { default: '#F7F8FC', paper: '#FFFFFF' },
    text: { primary: '#1A2027', secondary: '#6C757D' },
    success: { main: '#28A745' },
    error: { main: '#DC3545' },
};

const darkPalette = {
    primary: { main: '#9575CD' }, // Roxo um pouco mais claro para contraste
    background: { default: '#121212', paper: '#1E1E1E' },
    text: { primary: '#FFFFFF', secondary: '#A9A9A9' },
    success: { main: '#4CAF50' },
    error: { main: '#E57373' },
};

const commonSettings: ThemeOptions = {
    typography: {
        fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
        h4: { fontWeight: 700 },
        h5: { fontWeight: 600 },
        h6: { fontWeight: 600 },
    },
    components: {
        MuiAppBar: {
            styleOverrides: {
                root: { boxShadow: '0px 1px 4px rgba(100, 116, 139, 0.12)' },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    boxShadow: '0px 4px 20px rgba(100, 116, 139, 0.1)',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    textTransform: 'none',
                    fontWeight: 600,
                    boxShadow: 'none',
                },
            },
        },
    },
};

export const getTheme = (mode: 'light' | 'dark') =>
    createTheme({
        palette: {
            mode,
            ...(mode === 'light' ? lightPalette : darkPalette),
        },
        ...commonSettings,
        // Ajustes específicos do AppBar para cada modo
        components: {
            ...commonSettings.components,
            MuiAppBar: {
                styleOverrides: {
                    root: {
                        backgroundColor: mode === 'light' ? lightPalette.background.paper : darkPalette.background.paper,
                        color: mode === 'light' ? lightPalette.text.primary : darkPalette.text.primary,
                        boxShadow: 'none',
                        borderBottom: '1px solid',
                        borderColor: mode === 'light' ? '#E0E0E0' : '#2D2D2D',
                    }
                }
            }
        }
    });