import express from 'express';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import clientRoutes from './clientRoutes.js';
import supplierRoutes from './supplierRoutes.js';
import productRoutes from './productRoutes.js';
import accountsPayableRoutes from './accountsPayableRoutes.js';
import accountsReceivableRoutes from './accountsReceivableRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/clients', clientRoutes);
router.use('/suppliers', supplierRoutes);
router.use('/products', productRoutes);
router.use('/accounts-payable', accountsPayableRoutes);
router.use('/accounts-receivable', accountsReceivableRoutes);

export default router;