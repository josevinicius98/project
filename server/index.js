// server/routes/index.js
import express from 'express';
import authRoutes from './authRoutes.js'; //
import userRoutes from './userRoutes.js'; //
import clientRoutes from './clientRoutes.js'; // Supondo que você criará este
import supplierRoutes from './supplierRoutes.js'; // Adicionado recentemente
import productRoutes from './productRoutes.js'; // Supondo que você criará este
import accountsPayableRoutes from './accountsPayableRoutes.js'; // Supondo que você criará este
import accountsReceivableRoutes from './accountsReceivableRoutes.js'; // Supondo que você criará este

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
// router.use('/clients', clientRoutes); // Você teria criado clientRoutes.js similarmente
router.use('/suppliers', supplierRoutes); // Usa as novas rotas de fornecedores
// router.use('/products', productRoutes);
// router.use('/accounts-payable', accountsPayableRoutes);
// router.use('/accounts-receivable', accountsReceivableRoutes);

export default router;