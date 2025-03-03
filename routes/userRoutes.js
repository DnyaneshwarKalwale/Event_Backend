import { getUser , updateUser } from "../controllers/userController.js";
import express from 'express';
import { VarifyToken } from "../utils/Token.js";

const router = express.Router();


router.get('/get/:userId' , getUser);
router.post("/update-profile" , VarifyToken , updateUser)




export default router;