import { Router } from 'express';
import cartsController from '../controllers/carts.controller.js';

const router = Router();

router.get('/', cartsController.getAllCarts);
router.post('/', cartsController.createCart);
router.post('/:cid/products', cartsController.addToCart);
router.get('/:cid', cartsController.getCartWithProducts);
router.put('/:id', cartsController.updateCart);
router.put('/:cid', cartsController.updateCartWithProducts);
router.put('/:cid/products/:pid', cartsController.updateProductQuantity);
router.delete('/:id', cartsController.deleteCart);
router.delete('/:cid/products/:pid', cartsController.deleteProductFromCart);
router.delete('/:cid', cartsController.deleteAllProductsFromCart);

export default router;
