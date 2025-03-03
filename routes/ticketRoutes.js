import { createTicket, getTickets, makePayment } from '../../Event_Backend/controllers/ticketController.js';
import express from 'express';
import { VarifyToken } from '../utils/Token.js';


const router = express.Router();


router.post('/create', VarifyToken, createTicket);
router.post('/payment-done', makePayment);
router.get('/get-my-tickets', VarifyToken, getTickets);


export default router;


