// server/src/routes/wallet.routes.ts
import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';

// Importando os controllers
import { createWallet, getWallets, deleteWallet, getWalletSummary } from '../controllers/wallet.controller.js';
import { createTransaction, getTransactionsByWallet, updateTransaction, deleteTransaction } from '../controllers/transaction.controller.js';

const router = Router();

// Protege todas as rotas abaixo com autenticação
router.use(authMiddleware);

// --- ROTAS DE CARTEIRA (Wallets) ---
router.post('/', createWallet);
router.get('/', getWallets);
router.delete('/:walletId', deleteWallet);
router.get('/:walletId/summary', getWalletSummary);

// --- ROTAS DE TRANSAÇÕES (Aninhadas dentro de uma carteira) ---
// Note que agora as rotas de transação são mais específicas

// Criar uma nova transação (o walletId virá no corpo da requisição)
router.post('/transactions', createTransaction);

// Obter transações de uma carteira específica
router.get('/:walletId/transactions', getTransactionsByWallet);

// Atualizar uma transação específica
router.put('/transactions/:id', updateTransaction);

// Deletar uma transação específica
router.delete('/transactions/:id', deleteTransaction);


export default router;