import { Router } from 'express';
import productsController from '../controllers/products.controller.js';

const router = Router();

router.get('/', productsController.getAllProducts);
router.post('/', productsController.createProduct);

export default router;
