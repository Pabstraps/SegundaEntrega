import { Router } from 'express';
import productsModel from '../services/models/products.js';
import {cartsModel} from '../services/models/carts.js'; // Importa el modelo de carritos

const router = Router();

// Ruta para mostrar todos los productos con paginación
router.get('/products/', async (req, res) => {
    try {
        let page = parseInt(req.query.page);
        if (!page) page = 1;
        let result = await productsModel.paginate({}, { page, limit: 4, lean: true });
        result.prevLink = result.hasPrevPage ? `http://localhost:8080/views/products?page=${result.prevPage}` : '';
        result.nextLink = result.hasNextPage ? `http://localhost:8080/views/products?page=${result.nextPage}` : '';
        result.isValid = !(page < 1 || page > result.totalPages);
        res.render('viewProducts', result);
    } catch (error) {
        console.error("Error al obtener productos para la vista:", error);
        res.status(500).send({ error: "Error al obtener productos para la vista", message: error });
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
        console.error("Error al obtener detalles del producto:", error);
        res.status(500).send({ error: "Error al obtener detalles del producto", message: error });
    }
});

// Ruta para agregar un producto al carrito
router.post('/products/:pid/add-to-cart', async (req, res) => {
    try {
        const productId = req.params.pid;
        const cart = await cartsModel.findOne(); // Obtén el primer carrito disponible, puedes ajustar esta lógica según tus necesidades
        if (!cart) {
            return res.status(404).send({ error: "No hay carritos disponibles" });
        }
        cart.products.push(productId);
        await cart.save();
        res.redirect('/views/products'); // Redirige de vuelta a la página de productos después de agregar el producto al carrito
    } catch (error) {
        console.error("Error al agregar producto al carrito:", error);
        res.status(500).send({ error: "Error al agregar producto al carrito", message: error });
    }
});

export default router;

