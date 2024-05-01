import productsModel from '../models/product.model.js';

const productsMongoDAO = {};

productsMongoDAO.getAllProducts = async (page, limit) => {
    try {
        const options = {
            page: page,
            limit: limit
        };
        const products = await productsModel.paginate({}, options);
        return { products: products.docs, totalPages: products.totalPages };
    } catch (error) {
        throw new Error(`Error al obtener productos: ${error}`);
    }
};

productsMongoDAO.createProduct = async ({ title, description, code, price, stock, category }) => {
    try {
        const product = await productsModel.create({ title, description, code, price, stock, category });
        return product;
    } catch (error) {
        throw new Error(`Error al crear el producto: ${error}`);
    }
};

export default productsMongoDAO;
