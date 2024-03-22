import { Router } from 'express';
import productsModel from '../services/models/products.js'

const router = Router();

// Ruta para mostrar todos los productos con paginación
router.get('/products/', async (req, res) => {

        let page = parseInt(req.query.page);
        // let limit = parseInt(req.query.limit);
        if (!page) page = 1
        let result = await productsModel.paginate({}, { page, limit: 4, lean: true })
    
        result.prevLink = result.hasPrevPage ? `http://localhost:8080/views/products?page=${result.prevPage}` : '';
        result.nextLink = result.hasNextPage ? `http://localhost:8080/views/products?page=${result.nextPage}` : '';
    
        result.isValid = !(page < 1 || page > result.totalPages)

        res.render('viewProducts', result, );

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
