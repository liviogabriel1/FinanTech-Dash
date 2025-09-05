import React, { createContext, useState, useContext, useEffect } from 'react';
// ... (interfaces User e AuthContextType)
interface User {
    id: string;
    name: string;
    email: string;
}

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    loading: boolean; // Adicione o estado de loading
    login: (token: string, userData: User) => void;
    logout: () => void;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true); // Começa como true

    useEffect(() => {
        try {
            const token = localStorage.getItem('authToken');
            const userData = localStorage.getItem('authUser');
            if (token && userData) {
                setUser(JSON.parse(userData));
            }
        } catch (error) {
            console.error("Falha ao carregar dados de autenticação", error);
            // Garante que o estado seja limpo em caso de erro
            setUser(null);
            localStorage.removeItem('authToken');
            localStorage.removeItem('authUser');
        } finally {
            setLoading(false); // Termina o carregamento, independentemente do resultado
        }
    }, []);

    const login = (token: string, userData: User) => {
        localStorage.setItem('authToken', token);
        localStorage.setItem('authUser', JSON.stringify(userData));
        localStorage.setItem('hasVisited', 'true'); // <-- Adicionaremos isso para o segundo problema
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
        setUser(null);
    };

    const isAuthenticated = !!user;

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};


// Hook customizado para facilitar o uso do contexto
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
};