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


import productsMongoDAO from '../dataAccess/productsMongoDAO.js';

const productsController = {};

productsController.getAllProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const { products, totalPages } = await productsMongoDAO.getAllProducts(page, limit);
        const prevPage = page > 1 ? page - 1 : null;
        const nextPage = page < totalPages ? page + 1 : null;
        res.status(200).send({
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
        console.error("No se pudo obtener productos:", error);
        res.status(500).send({ error: "No se pudo obtener productos", message: error });
    }
};

productsController.createProduct = async (req, res) => {
    try {
        const { title, description, code, price, stock, category } = req.body;
        const product = await productsMongoDAO.createProduct({ title, description, code, price, stock, category });
        res.status(201).send({ status: "success", payload: product });
    } catch (error) {
        console.error("No se pudo crear el producto:", error);
        res.status(500).send({ error: "No se pudo crear el producto", message: error });
    }
};

export default productsController;
