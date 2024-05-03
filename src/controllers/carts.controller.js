import cartsModel  from '../models/cart.model.js';

import ticketsController from '../controllers/tickets.controller.js';


const cartsController = {};

cartsController.getAllCarts = async (req, res) => {
    try {
        let cart = await cartsModel.find();
        res.send({ result: "success", payload: cart })
    } catch (error) {
        console.error("No se pudo cargar el carrito: " + error);
        res.status(500).send({ error: "No se pudo cargar el carrito", message: error });
    }
};

cartsController.purchaseCart = async (req, res) => {
    try {
      const { cid } = req.params;
      const purchaserEmail = req.user.email;
  
      const ticket = await ticketsController.purchaseCart(cid, purchaserEmail);
      res.status(200).json({ status: 'success', ticket });
    } catch (error) {
      console.error('Error al procesar la compra:', error);
      res.status(500).json({ status: 'error', message: 'Error al procesar la compra' });
    }
  };

cartsController.createCart = async (req, res) => {
    try {
        let { title, description, code, price, stock, category } = req.body;
        let cart = await cartsModel.create({ title, description, code, price, stock, category });
        res.send({ result: "success", payload: cart });
    } catch (error) {
        console.error("No se pudo guardar el carrito con Mongoose: " + error);
        res.status(500).send({ error: "No se pudo guardar el carrito con Mongoose", message: error });
    }
};

cartsController.addToCart = async (req, res) => {
    try {
        const productId = req.params.pid;
        let cart = req.session.cart;
        if (!cart) {
            cart = await cartsModel.create({});
            req.session.cart = cart;
        }
        cart.products.push(productId);
        await cart.save();
        res.redirect('/api/products');
    } catch (error) {
        console.error("Error al agregar producto al carrito:", error);
        res.status(500).send({ error: "Error al agregar producto al carrito", message: error });
    }
};




cartsController.getCartWithProducts = async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartsModel.findById(cid).populate('products');
        if (!cart) {
            return res.status(404).send({ error: "Carrito no encontrado" });
        }
        res.send({ result: "success", payload: cart });
    } catch (error) {
        console.error("Error al obtener el carrito con los productos completos: " + error);
        res.status(500).send({ error: "Error al obtener el carrito con los productos completos", message: error });
    }
};

cartsController.updateCart = async (req, res) => {
    try {
        let cartUpdate = req.body;
        let cart = await cartsModel.updateOne({ _id: req.params.id }, cartUpdate);
        res.send({ result: "success", payload: cart });
    } catch (error) {
        console.error("No se pudo actualizar el carrito con Mongoose: " + error);
        res.status(500).send({ error: "No se pudo actualizar el carrito con Mongoose", message: error });
    }
};

cartsController.updateCartWithProducts = async (req, res) => {
    try {
        let { cid } = req.params;
        let { products } = req.body;
        let cart = await cartsModel.findById(cid);
        if (!cart) {
            return res.status(404).send({ error: "Carrito no encontrado" });
        }
        cart.products = products;
        await cart.save();
        res.status(200).send({ status: "success", message: "Carrito actualizado con nuevos productos" });
    } catch (error) {
        console.error("Error al actualizar carrito con nuevos productos: " + error);
        res.status(500).send({ error: "Error al actualizar carrito con nuevos productos", message: error });
    }
};

cartsController.updateProductQuantity = async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;

        let cart = await cartsModel.findById(cid);
        if (!cart) {
            return res.status(404).send({ error: "Carrito no encontrado" });
        }

        const productIndex = cart.products.findIndex(product => product._id == pid);
        if (productIndex === -1) {
            return res.status(404).send({ error: "Producto no encontrado en el carrito" });
        }

        cart.products[productIndex].quantity = quantity;
        await cart.save();
        
        res.status(200).send({ status: "success", message: "Cantidad de ejemplares actualizada en el carrito" });
    } catch (error) {
        console.error("Error al actualizar la cantidad de ejemplares del producto en el carrito: " + error);
        res.status(500).send({ error: "Error al actualizar la cantidad de ejemplares del producto en el carrito", message: error });
    }
};

cartsController.deleteCart = async (req, res) => {
    try {
        let { id } = req.params;
        let result = await cartsModel.deleteOne({ _id: id });
        res.status(202).send({ status: "success", payload: result });
    } catch (error) {
        console.error("No se pudo eliminar el carrito con Mongoose: " + error);
        res.status(500).send({ error: "No se pudo eliminar el carrito con Mongoose", message: error });
    }
};

cartsController.deleteProductFromCart = async (req, res) => {
    try {
        let { cid, pid } = req.params;
        let cart = await cartsModel.findById(cid);
        if (!cart) {
            return res.status(404).send({ error: "Carrito no encontrado" });
        }
        cart.products = cart.products.filter(product => product._id != pid);
        await cart.save();
        res.status(200).send({ status: "success", message: "Producto eliminado del carrito" });
    } catch (error) {
        console.error("Error al eliminar producto del carrito: " + error);
        res.status(500).send({ error: "Error al eliminar producto del carrito", message: error });
    }
};

cartsController.deleteAllProductsFromCart = async (req, res) => {
    try {
        const { cid } = req.params;
        let cart = await cartsModel.findById(cid);
        if (!cart) {
            return res.status(404).send({ error: "Carrito no encontrado" });
        }
        cart.products = [];
        await cart.save();
        res.status(200).send({ status: "success", message: "Todos los productos han sido eliminados del carrito" });
    } catch (error) {
        console.error("Error al eliminar todos los productos del carrito: " + error);
        res.status(500).send({ error: "Error al eliminar todos los productos del carrito", message: error });
    }
};

export default cartsController;
