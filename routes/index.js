import authRoutes from './authRoutes.js';
import express from 'express';
const router = express.Router();
import eventRoutes from './eventRoutes.js'
import userRoutes from './userRoutes.js'
import ticketRoutes from './ticketRoutes.js';



router.use('/auth', authRoutes);
router.use('/event', eventRoutes);
router.use('/user', userRoutes);
router.use('/ticket', ticketRoutes);


export default router;