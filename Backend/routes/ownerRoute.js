import express from "express"  
const router=express.Router();
import { singUp,signIn } from '../Controllers/ownerController.js';

router.post('/signUp',singUp)
router.post('/signIn',signIn)

export default router;
