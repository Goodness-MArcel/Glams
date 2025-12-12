import express from 'express';
import { initializePaystack, verifyPaystack } from '../controller/payments.js';

const router = express.Router();

// Initialize Paystack transaction
router.post('/paystack/initialize', initializePaystack);

// Verify Paystack transaction and create order
router.get('/paystack/verify', verifyPaystack);

export default router;
