// import productsModel from '../models/product.model.js';

// const productsController = {};

// productsController.getAllProducts = async (req, res) => {
//     try {
//         const page = parseInt(req.query.page) || 1;
//         const limit = parseInt(req.query.limit) || 10; 
//         const skip = (page - 1) * limit;

//         const totalProducts = await productsModel.countDocuments();
//         const totalPages = Math.ceil(totalProducts / limit);

//         const products = await productsModel.find().skip(skip).limit(limit);

//         const prevPage = page > 1 ? page - 1 : null;
//         const nextPage = page < totalPages ? page + 1 : null;

//         res.send({
//             status: "success",
//             payload: products,
//             total_pages: totalPages,
//             current_page: page,
//             prev_page: prevPage,
//             next_page: nextPage,
//             has_prev_page: prevPage !== null,
//             has_next_page: nextPage !== null
//         });
//     } catch (error) {
//         console.error("No se pudo obtener productos con mongoose: " + error);
//         res.status(500).send({ error: "No se pudo obtener productos con mongoose", message: error });
//     }
// };

// productsController.createProduct = async (req, res) => {
//     try {
//         let { title, description, code, price, stock, category } = req.body;
//         let product = await productsModel.create({ title, description, code, price, stock, category });
//         res.send({ result: "success", payload: product });
//     } catch (error) {
//         console.error("No se pudo crear el producto con Mongoose: " + error);
//         res.status(500).send({ error: "No se pudo crear el producto con Mongoose", message: error });
//     }
// };

// export default productsController;

import productsRepository from '../repositories/productsRepository.js';
import cartsModel from '../models/cart.model.js';
import productsModel from '../models/product.model.js';
import { checkProductOwnership } from '../services/middlewares/permissions.middleware.js';

const productsController = {};

productsController.getAllProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const { products, totalPages } = await productsRepository.getAllProducts(page, limit);
        const prevPage = page > 1 ? page - 1 : null;
        const nextPage = page < totalPages ? page + 1 : null;
        res.render('products', {
            status: "success",
            products: products.map(product => product.toObject()),
            total_pages: totalPages,
            current_page: page,
            prev_page: prevPage,
            next_page: nextPage,
            has_prev_page: prevPage !== null,
            has_next_page: nextPage !== null
        });
    } catch (error) {
        console.error("No se pudo obtener productos:", error);
        res.status(500).send({ error: "No se pudo obtener productos", message: error });
    }
};

productsController.getProductById = async (req, res) => {
    try {
        const product = await productsRepository.getProductById(req.params.pid);
        if (!product) {
            return res.status(404).send({ error: "Producto no encontrado" });
        }
        res.render('productDetails', { product });
    } catch (error) {
        console.error("Error al obtener detalles del producto:", error);
        res.status(500).send({ error: "Error al obtener detalles del producto", message: error });
    }
};

productsController.addToCart = async (req, res) => {
    try {
        const productId = req.params.pid;
        const user = req.user;

        const product = await productsModel.findById(productId);
        if (!product) {
            return res.status(404).send({ error: "Producto no encontrado" });
        }

        if (user.role === 'premium' && product.owner === user.email) {
            return res.status(400).send({ error: "No puedes agregar tu propio producto al carrito" });
        }

        let cart = await cartsModel.findOne({ user: user._id });
        if (!cart) {
            cart = new cartsModel({ title: 'Cart', user: user._id, products: [] });
        }

        cart.products.push(productId);
        await cart.save();
        res.redirect('/views/cart');
    } catch (error) {
        console.error("Error al agregar producto al carrito:", error);
        res.status(500).send({ error: "Error al agregar producto al carrito", message: error });
    }
};

productsController.getCart = async (req, res) => {
    try {
        const cart = await cartsModel.findOne({ user: req.user._id }).populate('products');
        if (!cart) {
            return res.render('cart', { products: [] });
        }
        const cartData = {
            products: cart.products.map(product => ({
                title: product.title,
                description: product.description,
                category: product.category,
                code: product.code,
                price: product.price,
                stock: product.stock
            }))
        };
        res.render('cart', cartData);
    } catch (error) {
        console.error("Error al obtener el carrito:", error);
        res.status(500).send({ error: "Error al obtener el carrito", message: error });
    }
};

productsController.createProduct = async (req, res) => {
    
    try {
        const { title, description, code, price, stock, category } = req.body;
        const owner = req.user.email;

        if (!title || !price || !description || !code || !stock || !category) {
            CustomError.createError({
                name: "User Creation Error",
                cause: generateProductErrorInfoESP(),
                message: "Error tratando de crear el producto.",
                code: EErrors.INVALID_TYPES_ERROR
            });
            return res.status(400).send({ error: "Faltan campos requeridos" });
        }
        
        const product = await productsRepository.createProduct({ title, description, code, price, stock, category, owner });
        
        console.log(`Producto creado por: ${owner}`);
        res.status(201).send({ status: "success", payload: product });
    } catch (error) {
        console.error("No se pudo crear el producto:", error);
        res.status(500).send({ error: "No se pudo crear el producto", message: error });
    }
};

productsController.updateProduct = [checkProductOwnership, async (req, res) => {
    try {
        const productId = req.params.id;
        const { title, description, code, price, stock, category } = req.body;
        const updatedProduct = await productsRepository.updateProduct(productId, { title, description, code, price, stock, category });
        if (!updatedProduct) {
            return res.status(404).send({ error: "Producto no encontrado" });
        }
        res.status(200).send({ status: "success", payload: updatedProduct });
    } catch (error) {
        console.error("No se pudo actualizar el producto:", error);
        res.status(500).send({ error: "No se pudo actualizar el producto", message: error });
    }
}];

productsController.deleteProduct = [checkProductOwnership, async (req, res) => {
    try {
        const productId = req.params.id;
        const deletedProduct = await productsRepository.deleteProduct(productId);
        if (!deletedProduct) {
            return res.status(404).send({ error: "Producto no encontrado" });
        }
        res.status(200).send({ status: "success", message: "Producto eliminado exitosamente" });
    } catch (error) {
        console.error("No se pudo eliminar el producto:", error);
        res.status(500).send({ error: "No se pudo eliminar el producto", message: error });
    }
}];

export default productsController;

