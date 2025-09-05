// src/components/ConfirmationDialog.tsx
import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';

interface ConfirmationDialogProps {
    open: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onClose: () => void;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({ open, title, message, onConfirm, onClose }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle fontWeight={700}>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>{message}</DialogContentText>
            </DialogContent>
            <DialogActions sx={{ p: '0 24px 16px' }}>
                <Button onClick={onClose}>Cancelar</Button>
                <Button onClick={onConfirm} color="error" variant="contained" autoFocus>
                    Confirmar Exclusão
                </Button>
            </DialogActions>
        </Dialog>
    );
};