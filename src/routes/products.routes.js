import { Router } from 'express';
import productsMongoController from '../controllers/products.controller.js';
import productsFileSystemController from '../controllers/productsFileSystem.controller.js';
import { isAdmin, isUser } from '../services/middlewares/auth.middleware.js';
import productsController from '../controllers/products.controller.js';


const router = Router();

// Rutas para MongoDB
router.get('/', isUser, productsMongoController.getAllProducts);
router.post('/', isAdmin, productsMongoController.createProduct);
router.put('/:id', isAdmin, productsMongoController.updateProduct);
router.delete('/:id', isAdmin, productsMongoController.deleteProduct);
router.post('/:pid/add-to-cart', productsController.addToCart);

router.get('/cart', productsController.getCart); 



// Rutas para FileSystem
router.get('/fs', isUser, productsFileSystemController.getAllProducts);
router.post('/fs', isAdmin, productsFileSystemController.createProduct);

export default router;


// import { Router } from 'express';
// import productsController from '../controllers/products.controller.js';
// import { isUser } from '../services/middlewares/auth.middleware.js';

// const router = Router();

// router.get('/', isUser, productsController.getAllProducts);
// router.post('/:pid/add-to-cart', isUser, productsController.addToCart);

// export default router;
