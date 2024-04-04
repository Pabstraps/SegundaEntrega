import { Router } from 'express';
import productsModel from '../services/models/products.js'

// import fs from 'fs';
// import __dirname from '../utils.js'
// import path from 'path';

// const router = Router();

// // Ruta al archivo JSON de productos
// const productsFilePath = path.join(__dirname, '../src/files/products.json');

// // Función para leer el contenido del archivo products.json
// const readProductsFromFile = () => {
//     try {
//         const productsData = fs.readFileSync(productsFilePath, 'utf8');
//         return JSON.parse(productsData);
//     } catch (error) {
//         console.error('Error al leer el archivo de productos:', error);
//         return [];
//     }
// };

// // Función para escribir el array de productos en el archivo products.json
// const writeProductsToFile = (products) => {
//     try {
//         fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 4));
//         console.log('Productos agregados al archivo correctamente.');
//     } catch (error) {
//         console.error('Error al escribir en el archivo de productos:', error);
//     }
// };

// let products = readProductsFromFile();

// // Ruta para mostrar los productos almacenadas en el Json
// router.get('/', (req, res) => {
//     console.log("Productos disponibles: ");
//     console.log(products);
//     res.send(products);
//  });

//  // Ruta para mostrar el producto por medio de su ID 
// router.get('/:cid', (req, res) => {
//     let { pid } = req.params
//     console.log(pid);

//     const product = products.find(u => u.id === parseInt(pid))
//     if (product) {
//         res.json({ product })
//     }
//     res.send({ msg: "Producto no encontrado" })
// });

// // Ruta para agregar un producto
// router.post('/', (req, res) => {
//     let product = req.body
//     product.id = Math.floor(Math.random() * 20 + 1);

//     if (!product.title || !product.description || !product.code || !product.price || !product.stock || !product.category) {
//         console.error("Faltan campos por llenar");
//         console.error(products);
//         res.status(400).send({ status: "Error", message: "imposible agregar producto, verifique los datos de entrada."});
//     } else {
//         products.push(product)
//         writeProductsToFile(products);
//         console.log(products);
//         res.send({ status: "Success", message: `Producto agregado con exito, con ID: ${product.id}`});
//     }
// });

// // Ruta para actualizar un producto por medio de su ID
// router.put('/:cid', (req, res) => {
//     let productId = parseInt(req.params.pid)
//     let productUpdate = req.body

//     const productPosition = products.findIndex((u => u.id === productId));
//     if (productPosition < 0) {
//         return res.status(202).send({ status: "info", error: "Producto no encontrado" });
//     }
    
//     productUpdate.id = productId;

//     products[productPosition] = productUpdate;
//     writeProductsToFile(products); // Escribir productos en el archivo
//     res.send({ status: "Success", message: "Producto Actualizado.", data: products[productPosition] }); 
// });

// // Ruta para eliminar un producto por medio de su ID
// router.delete('/:cid', (req, res) => {
//     let ProductId = parseInt(req.params.pid);

//     const productSize = products.length;
//     const productPosition = products.findIndex((u => u.id === ProductId));
//     if (productPosition < 0) {
//         return res.status(202).send({ status: "info", error: "Producto no encontrado"});
//     }
//     products.splice(productPosition, 1);
//     if (products.length === productSize) {
//         return res.status(500).send({ status: "error", error: "Producto no se pudo borrar." });
//     }

//     writeProductsToFile(products); 
//     res.send({ status: "Success", message: "Producto Eliminado." }); 
// });


const router = Router();

// // GET
// router.get('/', async (req, res) => {
//     try {
//         let products = await productsModel.find();
//         res.send({ result: "success", payload: products })
//     } catch (error) {
//         console.error("No se pudo obtener usuarios con moongose: " + error);
//         res.status(500).send({ error: "No se pudo obtener usuarios con moongose", message: error });
//     }
// })

// GET
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10; // Cambia el límite según tus necesidades
        const skip = (page - 1) * limit;

        // Obtener la cantidad total de productos
        const totalProducts = await productsModel.countDocuments();

        // Calcular el total de páginas
        const totalPages = Math.ceil(totalProducts / limit);

        // Obtener los productos para la página actual
        const products = await productsModel.find().skip(skip).limit(limit);

        // Configurar los enlaces para la paginación
        const prevPage = page > 1 ? page - 1 : null;
        const nextPage = page < totalPages ? page + 1 : null;

        // Devolver la respuesta con el formato específico
        res.send({
            status: "success",
            payload: products,
            total_pages: totalPages,
            current_page: page,
            prev_page: prevPage,
            next_page: nextPage,
            has_prev_page: prevPage !== null,
            has_next_page: nextPage !== null
        });
    } catch (error) {
        console.error("No se pudo obtener usuarios con mongoose: " + error);
        res.status(500).send({ error: "No se pudo obtener usuarios con mongoose", message: error });
    }
});


// POST
router.post('/', async (req, res) => {
    try {
        let { title, description, code, price, stock, category } = req.body;
        let product = await productsModel.create({ title, description, code, price, stock, category });
        res.send({ result: "success", payload: product });
    } catch (error) {
        console.error("No se pudo crear el producto con Mongoose: " + error);
        res.status(500).send({ error: "No se pudo crear el producto con Mongoose", message: error });
    }
});
 




export default router;
