import { Router } from 'express';
import productsModel from '../models/product.model.js';
import cartsModel from '../models/cart.model.js'; 

const router = Router();

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

router.post('/products/:pid/add-to-cart', async (req, res) => {
    try {
        const productId = req.params.pid;
        const cart = await cartsModel.findOne(); 
        if (!cart) {
            return res.status(404).send({ error: "No hay carritos disponibles" });
        }
        cart.products.push(productId);
        await cart.save();
        res.redirect('/views/products'); 
    } catch (error) {
        console.error("Error al agregar producto al carrito:", error);
        res.status(500).send({ error: "Error al agregar producto al carrito", message: error });
    }
});

export default router;
