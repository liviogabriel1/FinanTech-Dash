// src/pages/Dashboard.tsx
import { useEffect, useState } from 'react';
import { Box, Button, Container, List, ListItem, ListItemText, Typography, IconButton, Paper, CircularProgress, Pagination } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PieChartOutlineIcon from '@mui/icons-material/PieChartOutline';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useWallets } from '../context/WalletContext';
import api from '../services/api';
import { AddTransactionModal } from '../components/AddTransactionModal';
import { ConfirmationDialog } from '../components/ConfirmationDialog';

interface Transaction {
    id: string; title: string; amount: number; category: string; date: string; type: 'INCOME' | 'EXPENSE';
}
interface SummaryData {
    totalIncome: number; totalExpense: number; balance: number;
    expensesByCategory: { name: string, value: number }[];
    incomesByCategory: { name: string, value: number }[];
}
const COLORS = ['#7E57C2', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

export function Dashboard() {
    const { selectedWallet } = useWallets();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [transactionModalOpen, setTransactionModalOpen] = useState(false);
    const [transactionToEdit, setTransactionToEdit] = useState<Transaction | null>(null);
    const [confirmDeleteTxOpen, setConfirmDeleteTxOpen] = useState(false);
    const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);

    const fetchDashboardData = async (page = 1) => {
        if (!selectedWallet) { setLoading(false); return; }
        try {
            setLoading(true);
            const [summaryRes, transactionsRes] = await Promise.all([
                api.get(`/wallets/${selectedWallet.id}/summary`),
                api.get(`/wallets/${selectedWallet.id}/transactions?page=${page}&limit=5`)
            ]);
            setSummaryData(summaryRes.data);
            setTransactions(transactionsRes.data.transactions);
            setTotalPages(transactionsRes.data.totalPages);
        } catch (error) { console.error("Erro ao buscar dados da carteira:", error); }
        finally { setLoading(false); }
    };

    const fetchTransactionsPage = async (page: number) => {
        if (!selectedWallet) return;
        try {
            setLoading(true);
            const res = await api.get(`/wallets/${selectedWallet.id}/transactions?page=${page}&limit=5`);
            setTransactions(res.data.transactions);
            setTotalPages(res.data.totalPages);
        } catch (error) { console.error("Erro ao buscar página de transações:", error); }
        finally { setLoading(false); }
    };

    useEffect(() => { setCurrentPage(1); fetchDashboardData(1); }, [selectedWallet]);
    useEffect(() => { if (currentPage > 1) fetchTransactionsPage(currentPage); }, [currentPage]);

    const handleDataUpdate = () => { fetchDashboardData(currentPage); };
    const handleDelete = (id: string) => { setTransactionToDelete(id); setConfirmDeleteTxOpen(true); };
    const handleEdit = (transaction: Transaction) => { setTransactionToEdit(transaction); setTransactionModalOpen(true); };
    const handleOpenCreateModal = () => { setTransactionToEdit(null); setTransactionModalOpen(true); };

    const handleConfirmDeleteTx = async () => {
        if (!transactionToDelete) return;
        try {
            await api.delete(`/wallets/transactions/${transactionToDelete}`);
            handleDataUpdate();
        } catch (error) { console.error('Erro ao deletar transação', error); }
        finally { setConfirmDeleteTxOpen(false); setTransactionToDelete(null); }
    };

    return (
        <Container maxWidth="lg">
            <AddTransactionModal open={transactionModalOpen} onClose={() => setTransactionModalOpen(false)} onTransactionUpdated={handleDataUpdate} transactionToEdit={transactionToEdit} />
            <ConfirmationDialog open={confirmDeleteTxOpen} onClose={() => setConfirmDeleteTxOpen(false)} onConfirm={handleConfirmDeleteTx} title="Excluir Transação?" message="Tem certeza que deseja excluir esta transação? Esta ação não pode ser desfeita." />

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}><CircularProgress /></Box>
            ) : !selectedWallet ? (
                <Box sx={{ textAlign: 'center', mt: 10 }}>
                    <Typography variant="h5">Bem-vindo!</Typography><Typography color="text.secondary">Selecione uma carteira para começar ou crie uma nova no menu superior.</Typography>
                </Box>
            ) : (
                <>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                        <Typography variant="h4" fontWeight={700}>Dashboard</Typography>
                        <Button variant="contained" onClick={handleOpenCreateModal} disabled={!selectedWallet}>Nova Transação</Button>
                    </Box>
                    <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={3} sx={{ mb: 3 }}>
                        <Box gridColumn={{ xs: 'span 12', md: 'span 4' }}><Paper sx={{ p: 3, textAlign: 'center' }}><Typography variant="h6">Receitas</Typography><Typography variant="h5" color="success.main" sx={{ fontWeight: 700 }}>R$ {summaryData?.totalIncome.toFixed(2)}</Typography></Paper></Box>
                        <Box gridColumn={{ xs: 'span 12', md: 'span 4' }}><Paper sx={{ p: 3, textAlign: 'center' }}><Typography variant="h6">Despesas</Typography><Typography variant="h5" color="error.main" sx={{ fontWeight: 700 }}>R$ {summaryData?.totalExpense.toFixed(2)}</Typography></Paper></Box>
                        <Box gridColumn={{ xs: 'span 12', md: 'span 4' }}><Paper sx={{ p: 3, textAlign: 'center' }}><Typography variant="h6">Saldo</Typography><Typography variant="h5" sx={{ fontWeight: 700, color: '#1976D2' }}>R$ {summaryData?.balance.toFixed(2)}</Typography></Paper></Box>
                    </Box>
                    <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={3} sx={{ mb: 3 }}>
                        <Box gridColumn={{ xs: 'span 12', md: 'span 6' }}>
                            <Paper sx={{ p: 2, height: 350 }}><Typography variant="h5" gutterBottom sx={{ ml: 2, mt: 1 }}>Despesas por Categoria</Typography>
                                {summaryData && summaryData.expensesByCategory.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="90%"><PieChart>
                                        <Pie data={summaryData.expensesByCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#8884d8" paddingAngle={5} label>
                                            {summaryData.expensesByCategory.map((_, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
                                        </Pie><Tooltip formatter={(value: number) => `R$ ${value.toFixed(2)}`} /></PieChart></ResponsiveContainer>
                                ) : (<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '90%', color: 'text.secondary' }}><PieChartOutlineIcon sx={{ fontSize: 60, mb: 2 }} /><Typography>Nenhuma despesa registrada</Typography></Box>)}
                            </Paper>
                        </Box>
                        <Box gridColumn={{ xs: 'span 12', md: 'span 6' }}>
                            <Paper sx={{ p: 2, height: 350 }}><Typography variant="h5" gutterBottom sx={{ ml: 2, mt: 1 }}>Receitas por Categoria</Typography>
                                {summaryData && summaryData.incomesByCategory.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="90%"><PieChart>
                                        <Pie data={summaryData.incomesByCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#28A745" paddingAngle={5} label>
                                            {summaryData.incomesByCategory.map((_, index) => (<Cell key={`cell-${index}`} fill={COLORS.slice().reverse()[index % COLORS.length]} />))}
                                        </Pie><Tooltip formatter={(value: number) => `R$ ${value.toFixed(2)}`} /></PieChart></ResponsiveContainer>
                                ) : (<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '90%', color: 'text.secondary' }}><PieChartOutlineIcon sx={{ fontSize: 60, mb: 2 }} /><Typography>Nenhuma receita registrada</Typography></Box>)}
                            </Paper>
                        </Box>
                    </Box>
                    <Box gridColumn="span 12">
                        <Paper sx={{ height: 350, p: 2, display: 'flex', flexDirection: 'column' }}>
                            <Typography variant="h5" gutterBottom>Histórico de Transações</Typography>
                            <Box sx={{ flexGrow: 1, overflow: 'auto', pr: 1 }}>
                                <List sx={{ pt: 0 }}>
                                    {transactions.length > 0 ? transactions.map((t) => (
                                        <ListItem key={t.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1.5 }} >
                                            <ListItemText primary={t.title} secondary={`${new Date(t.date).toLocaleDateString()} - ${t.category}`} />
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                                <Typography color={t.type === 'INCOME' ? 'success.main' : 'error.main'} sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>{t.type === 'INCOME' ? '+' : '-'} R$ {t.amount.toFixed(2)}</Typography>
                                                <Box>
                                                    <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(t)} size="small"><EditIcon fontSize="small" /></IconButton>
                                                    <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(t.id)} size="small" sx={{ ml: 0.5 }}><DeleteIcon fontSize="small" /></IconButton>
                                                </Box>
                                            </Box>
                                        </ListItem>
                                    )) : (<Typography sx={{ textAlign: 'center', p: 4, color: 'text.secondary' }}>Nenhuma transação nesta página.</Typography>)}
                                </List>
                            </Box>
                            {totalPages > 1 && (
                                <Box sx={{ display: 'flex', justifyContent: 'center', pt: 2, borderTop: 1, borderColor: 'divider' }}>
                                    <Pagination count={totalPages} page={currentPage} onChange={(_, value) => setCurrentPage(value)} color="primary" />
                                </Box>
                            )}
                        </Paper>
                    </Box>
                </>
            )}
        </Container>
    );
}