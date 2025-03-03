import {Signup , Signin} from '../controllers/authControllers.js';
import express from 'express';
import { VarifyToken } from '../utils/Token.js';


const router = express.Router();


router.post("/sign-up" , Signup)
router.post("/sign-in" , Signin)


export default router;