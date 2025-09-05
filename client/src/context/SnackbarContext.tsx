// src/context/SnackbarContext.tsx
import React, { createContext, useState, useContext } from 'react';
import { Snackbar, Alert } from '@mui/material';
import type { AlertColor } from '@mui/material/Alert';

interface SnackbarContextType {
    showSnackbar: (message: string, severity?: AlertColor) => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export const SnackbarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState<AlertColor>('success');

    const showSnackbar = (newMessage: string, newSeverity: AlertColor = 'success') => {
        setMessage(newMessage);
        setSeverity(newSeverity);
        setOpen(true);
    };

    const handleClose = (_?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    return (
        <SnackbarContext.Provider value={{ showSnackbar }}>
            {children}
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
                    {message}
                </Alert>
            </Snackbar>
        </SnackbarContext.Provider>
    );
};

export const useSnackbar = () => {
    const context = useContext(SnackbarContext);
    if (context === undefined) {
        throw new Error('useSnackbar deve ser usado dentro de um SnackbarProvider');
    }
    return context;
};