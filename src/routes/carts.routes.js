import { Router } from 'express';
import { cartsModel } from '../services/models/carts.js';

const router = Router();

// POST - Crear un carrito
router.post('/', async (req, res) => {
    try {
        let { title, description, code, price, stock, category } = req.body;
        let cart = await cartsModel.create({ title, description, code, price, stock, category });
        res.send({ result: "success", payload: cart });
    } catch (error) {
        console.error("No se pudo guardar el carrito con Mongoose: " + error);
        res.status(500).send({ error: "No se pudo guardar el carrito con Mongoose", message: error });
    }
});

// PUT - Actualizar un carrito
router.put('/:id', async (req, res) => {
    try {
        let cartUpdate = req.body;
        let cart = await cartsModel.updateOne({ _id: req.params.id }, cartUpdate);
        res.send({ result: "success", payload: cart });
    } catch (error) {
        console.error("No se pudo actualizar el carrito con Mongoose: " + error);
        res.status(500).send({ error: "No se pudo actualizar el carrito con Mongoose", message: error });
    }
});

// PUT - Actualizar un carrito con un arreglo de productos
router.put('/:cid', async (req, res) => {
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
});

// PUT - Actualizar la cantidad de ejemplares de un producto en el carrito
router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;

        // Buscar el carrito por su ID
        let cart = await cartsModel.findById(cid);
        if (!cart) {
            return res.status(404).send({ error: "Carrito no encontrado" });
        }

        // Buscar el producto en el carrito
        const productIndex = cart.products.findIndex(product => product._id == pid);
        if (productIndex === -1) {
            return res.status(404).send({ error: "Producto no encontrado en el carrito" });
        }

        // Actualizar la cantidad de ejemplares del producto
        cart.products[productIndex].quantity = quantity;

        // Guardar la actualización del carrito en la base de datos
        await cart.save();
        
        res.status(200).send({ status: "success", message: "Cantidad de ejemplares actualizada en el carrito" });
    } catch (error) {
        console.error("Error al actualizar la cantidad de ejemplares del producto en el carrito: " + error);
        res.status(500).send({ error: "Error al actualizar la cantidad de ejemplares del producto en el carrito", message: error });
    }
});


// DELETE - Eliminar un carrito
router.delete('/:id', async (req, res) => {
    try {
        let { id } = req.params;
        let result = await cartsModel.deleteOne({ _id: id });
        res.status(202).send({ status: "success", payload: result });
    } catch (error) {
        console.error("No se pudo eliminar el carrito con Mongoose: " + error);
        res.status(500).send({ error: "No se pudo eliminar el carrito con Mongoose", message: error });
    }
});

// DELETE - Eliminar un producto específico del carrito
router.delete('/:cid/products/:pid', async (req, res) => {
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
});

router.delete('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;

        // Buscar el carrito por su ID
        let cart = await cartsModel.findById(cid);
        if (!cart) {
            return res.status(404).send({ error: "Carrito no encontrado" });
        }

        // Eliminar todos los productos del carrito
        cart.products = [];

        // Guardar la actualización del carrito en la base de datos
        await cart.save();
        
        res.status(200).send({ status: "success", message: "Todos los productos han sido eliminados del carrito" });
    } catch (error) {
        console.error("Error al eliminar todos los productos del carrito: " + error);
        res.status(500).send({ error: "Error al eliminar todos los productos del carrito", message: error });
    }
});

export default router;



// import fs from 'fs';
// import path from 'path';
// import __dirname from '../utils.js'

// const router = Router();

// // Rutas a los archivos JSON
// const productsFilePath = path.join(__dirname, '../src/files/products.json');
// const cartsFilePath = path.join(__dirname, '../src/files/carts.json');

// function generateUniqueId() {
//     return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
// }

// // Función para leer el contenido del archivo JSON
// const readJSONFile = (filePath) => {
//     try {
//         const data = fs.readFileSync(filePath, 'utf8');
//         return JSON.parse(data);
//     } catch (error) {
//         console.error(`Error al leer el archivo JSON ${filePath}:`, error);
//         return [];
//     }
// };

// // Función para escribir el contenido en el archivo JSON
// const writeJSONFile = (filePath, data) => {
//     try {
//         fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
//         console.log(`Datos escritos en el archivo JSON ${filePath} correctamente.`);
//     } catch (error) {
//         console.error(`Error al escribir en el archivo JSON ${filePath}:`, error);
//     }
// };

// // Ruta para agregar un producto al carrito
// router.post('/:cid', (req, res) => {
//     const { cid } = req.params;
    
//     let products = readJSONFile(productsFilePath);
//     let carts = readJSONFile(cartsFilePath);

//     const product = products.find(p => p.id === parseInt(cid));
//     if (!product) {
//         return res.status(404).json({ error: "Producto no encontrado" });
//     }

//     const existingCartItemIndex = carts.findIndex(cart => cart.items.some(item => item.productId === product.id));
//     if (existingCartItemIndex !== -1) {
//         carts[existingCartItemIndex].items.find(item => item.productId === product.id).quantity++;
//     } else {
//         const cartId = generateUniqueId();
//         const cart = { id: cartId, items: [{ productId: product.id, quantity: 1 }] };
//         carts.push(cart);
//     }

//     writeJSONFile(cartsFilePath, carts);

//     res.status(200).json({ status: "Success", message: "Producto agregado al carrito"});
// });

// // Ruta para mostrar los productos del carrito
// router.get('/:cid', (req, res) => {
//     const cartId = req.params.cid;
    
//     const carts = readJSONFile(cartsFilePath);
//     const cart = carts.find(cart => cart.id === cartId);
 
//     if (!cart) {
//         return res.status(404).json({ status: "error", message: "Carrito no encontrado" });
//     }
//     const productsInCart = [];

//     cart.items.forEach(item => {
//         const product = readJSONFile(productsFilePath).find(product => product.id === item.productId);
//         if (product) {
//             productsInCart.push({ ...product, quantity: item.quantity });
//         }
//     });

//     res.status(200).json({ status: "success", products: productsInCart });
// });


// router.post('/:cid/product/:pid', (req, res) => {
//     const { cid, pid } = req.params;

//     // Leer carritos actuales del archivo JSON
//     let carts = readJSONFile(cartsFilePath);

//     // Buscar el carrito con el ID proporcionado
//     const cartIndex = carts.findIndex(cart => cart.id === cid);

//     // Verificar si el carrito existe
//     if (cartIndex === -1) {
//         return res.status(404).json({ status: "error", message: "Carrito no encontrado" });
//     }

//     // Obtener el producto a agregar al carrito
//     const productToAdd = {
//         productId: pid,
//         quantity: 1  // Podrías ajustar la cantidad según lo necesites
//     };

//     // Agregar el producto al arreglo de productos del carrito
//     carts[cartIndex].items.push(productToAdd);

//     // Escribir los carritos actualizados en el archivo JSON
//     writeJSONFile(cartsFilePath, carts);

//     res.status(200).json({ status: "success", message: "Producto agregado al carrito" });
// });

