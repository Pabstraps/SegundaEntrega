import { Router } from 'express';
import productsMongoController from '../controllers/products.controller.js';
import productsFileSystemController from '../controllers/productsFileSystem.controller.js';

const router = Router();

// Rutas para MongoDB
router.get('/mongo', productsMongoController.getAllProducts);
router.post('/mongo', productsMongoController.createProduct);

// Rutas para FileSystem
router.get('/fs', productsFileSystemController.getAllProducts);
router.post('/fs', productsFileSystemController.createProduct);

export default router;
