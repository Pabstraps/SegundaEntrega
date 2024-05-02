// import { Router } from 'express';
// import productsMongoController from '../controllers/products.controller.js';
// import productsFileSystemController from '../controllers/productsFileSystem.controller.js';
// import { isAdmin, isUser } from '../services/middlewares/auth.middleware.js';

// const router = Router();

// // Rutas para MongoDB
// router.get('/', isAdmin, productsMongoController.getAllProducts);
// router.post('/', isAdmin, productsMongoController.createProduct);
// router.put('/:id', isAdmin, productsMongoController.updateProduct);
// router.delete('/:id', isAdmin, productsMongoController.deleteProduct);

// // Rutas para FileSystem
// router.get('/fs', isUser, productsFileSystemController.getAllProducts);
// router.post('/fs', isAdmin, productsFileSystemController.createProduct);

// export default router;


import { Router } from 'express';
import productsController from '../controllers/products.controller.js';

const router = Router();

router.get('/', productsController.getAllProducts);
router.get('/:pid', productsController.getProductById);
router.post('/:pid/add-to-cart', productsController.addProductToCart);

export default router;

