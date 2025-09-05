// src/context/ThemeContext.tsx
import React, { createContext, useState, useMemo, useContext } from 'react';

interface ThemeContextType {
    mode: 'light' | 'dark';
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeToggleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [mode, setMode] = useState<'light' | 'dark'>('light');

    const toggleTheme = () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
    };

    const value = useMemo(() => ({ mode, toggleTheme }), [mode]);

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useThemeToggle = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useThemeToggle deve ser usado dentro de um ThemeToggleProvider');
    }
    return context;
};