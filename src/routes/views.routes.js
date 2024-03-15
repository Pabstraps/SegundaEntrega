import { Router } from 'express';
import { productsModel } from '../services/models/products.js';

const router = Router();

// Ruta para mostrar todos los productos con paginación
router.get('/products', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        // Calcular el índice de inicio y el límite de productos a mostrar
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        // Obtener la cantidad total de productos
        const totalProducts = await productsModel.countDocuments({});

        // Obtener los productos de la página actual
        const products = await productsModel.find().limit(limit).skip(startIndex);

        // Paginación
        const pagination = {};
        if (endIndex < totalProducts) {
            pagination.next = {
                page: page + 1,
                limit: limit
            }
        }

        if (startIndex > 0) {
            pagination.prev = {
                page: page - 1,
                limit: limit
            }
        }

        res.render('products', { products, pagination });
    } catch (error) {
        console.error("Error al obtener productos con paginación: " + error);
        res.status(500).send({ error: "Error al obtener productos con paginación", message: error });
    }
});

// Ruta para mostrar detalles de un producto específico
router.get('/products/:pid', async (req, res) => {
    try {
        const product = await productsModel.findById(req.params.pid);
        if (!product) {
            return res.status(404).send({ error: "Producto no encontrado" });
        }
        res.render('productDetails', { product });
    } catch (error) {
        console.error("Error al obtener detalles del producto: " + error);
        res.status(500).send({ error: "Error al obtener detalles del producto", message: error });
    }
});

export default router;
