import { createEvent, getEvent, getEvents, getMyEvents, getOrders, getPopularEvents, getUsersEvents } from "../controllers/eventController.js";
import express from 'express';
import { VarifyToken } from '../utils/Token.js'

const router = express.Router();



router.post('/create', VarifyToken, createEvent);
router.get('/get-users-events/:userId', getUsersEvents);
router.get('/get-my-events', VarifyToken, getMyEvents);
router.get('/get-event/:eventId', getEvent);
router.get('/get-events', getEvents);
router.get('/get-popular-events', getPopularEvents);
router.get('/orders/:eventId',VarifyToken , getOrders);


export default router;