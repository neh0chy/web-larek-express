import { Router } from 'express';
import { getProducts, addProduct } from '../controllers/products';
import { productRouteValidator } from '../middlewares/validation';

const router = Router();
router.get('/product', productRouteValidator, getProducts);
router.post('/product', productRouteValidator, addProduct);

export default router;
