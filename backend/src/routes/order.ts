import { Router } from 'express';
import placeOrder from '../controllers/order';
import { orderRouteValidator } from '../middlewares/validation';

const router = Router();
router.post('/order', orderRouteValidator, placeOrder);

export default router;
