// src/context/WalletContext.tsx
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

// Interface para definir o formato de uma carteira
interface Wallet {
    id: string;
    name: string;
}

// Interface para o que nosso contexto irá fornecer
interface WalletContextType {
    wallets: Wallet[];
    selectedWallet: Wallet | null;
    selectWallet: (walletId: string) => void;
    refreshWallets: () => void; // Para atualizar a lista após criar uma nova carteira
    loading: boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const [wallets, setWallets] = useState<Wallet[]>([]);
    const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchWallets = useCallback(async () => {
        if (isAuthenticated) {
            try {
                setLoading(true);
                const response = await api.get('/wallets');
                const userWallets = response.data;
                setWallets(userWallets);

                // Se houver carteiras, seleciona a primeira como padrão
                if (userWallets.length > 0) {
                    setSelectedWallet(userWallets[0]);
                } else {
                    setSelectedWallet(null);
                }
            } catch (error) {
                console.error("Erro ao buscar carteiras:", error);
                setWallets([]);
                setSelectedWallet(null);
            } finally {
                setLoading(false);
            }
        }
    }, [isAuthenticated]);

    useEffect(() => {
        fetchWallets();
    }, [fetchWallets]);

    const selectWallet = (walletId: string) => {
        const wallet = wallets.find(w => w.id === walletId);
        if (wallet) {
            setSelectedWallet(wallet);
        }
    };

    // A função `refreshWallets` é simplesmente um apelido para `fetchWallets`
    const refreshWallets = fetchWallets;

    const value = { wallets, selectedWallet, selectWallet, refreshWallets, loading };

    return (
        <WalletContext.Provider value={value}>
            {children}
        </WalletContext.Provider>
    );
};

// Hook customizado para facilitar o uso do contexto
export const useWallets = () => {
    const context = useContext(WalletContext);
    if (context === undefined) {
        throw new Error('useWallets deve ser usado dentro de um WalletProvider');
    }
    return context;
};