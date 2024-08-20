import { Router } from 'express';
import { placeOrder } from '../controllers/order';

const router = Router();
router.post('/order', placeOrder);

export default router;
