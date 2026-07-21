import express from "express";
const router = express.Router();

import { singUp, signIn, ownerExists } from '../Controllers/ownerController.js';

router.get('/exists', ownerExists);
router.post('/signUp', singUp);
router.post('/signIn', signIn);

export default router;