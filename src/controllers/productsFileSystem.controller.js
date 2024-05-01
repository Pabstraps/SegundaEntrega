import productsFileSystemDAO from '../dataAccess/productsFileSystemDAO.js';

const productsFileSystemController = {};

productsFileSystemController.getAllProducts = async (req, res) => {
    try {
        const products = await productsFileSystemDAO.getAllProducts();
        res.send({
            status: "success",
            payload: products
        });
    } catch (error) {
        console.error("No se pudo obtener productos del sistema de archivos: " + error);
        res.status(500).send({ error: "No se pudo obtener productos del sistema de archivos", message: error });
    }
};

productsFileSystemController.createProduct = async (req, res) => {
    try {
        const { title, description, code, price, stock, category } = req.body;
        const product = { title, description, code, price, stock, category };
        const createdProduct = await productsFileSystemDAO.createProduct(product);
        res.send({ result: "success", payload: createdProduct });
    } catch (error) {
        console.error("No se pudo crear el producto en el sistema de archivos: " + error);
        res.status(500).send({ error: "No se pudo crear el producto en el sistema de archivos", message: error });
    }
};

export default productsFileSystemController;
