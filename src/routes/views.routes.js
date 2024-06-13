import { Router } from 'express';
import productsModel from '../models/product.model.js';
import cartsModel from '../models/cart.model.js'; 

const router = Router();

router.get('/products/', async (req, res) => {
    try {
        let products = await productsModel.find();
        res.send({ result: "success", payload: products })
    } catch (error) {
        console.error("No se pudo obtener los productos: " + error);
        res.status(500).send({ error: "No se pudo obtener los productos con moongose", message: error });
    }
})

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

router.get("/cart", (req, res) => {
    res.render('cart')
});

export default router;
