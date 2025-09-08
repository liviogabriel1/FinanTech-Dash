// src/components/PasswordStrengthMeter.tsx
import { Box, Typography, List, ListItem, ListItemIcon } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

interface PasswordStrengthMeterProps {
    password?: string;
}

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ password = '' }) => {
    const checks = {
        minLength: password.length >= 8,
        hasUppercase: /[A-Z]/.test(password),
        hasLowercase: /[a-z]/.test(password),
        hasNumber: /[0-9]/.test(password),
        hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    const Requirement = ({ met, text }: { met: boolean; text: string }) => (
        <ListItem sx={{ py: 0.2, px: 0 }}>
            <ListItemIcon sx={{ minWidth: 'auto', mr: 1 }}>
                {met ? (
                    <CheckCircleIcon color="success" fontSize="small" />
                ) : (
                    <CancelIcon color="error" fontSize="small" />
                )}
            </ListItemIcon>
            <Typography variant="body2" color={met ? 'success.main' : 'error.main'}>
                {text}
            </Typography>
        </ListItem>
    );

    return (
        <Box sx={{ mt: 2 }}>
            <List>
                <Requirement met={checks.minLength} text="Pelo menos 8 caracteres" />
                <Requirement met={checks.hasLowercase} text="Pelo menos uma letra minúscula" />
                <Requirement met={checks.hasUppercase} text="Pelo menos uma letra maiúscula" />
                <Requirement met={checks.hasNumber} text="Pelo menos um número" />
                <Requirement met={checks.hasSpecialChar} text="Pelo menos um caracter especial (!@#$%)" />
            </List>
        </Box>
    );
};