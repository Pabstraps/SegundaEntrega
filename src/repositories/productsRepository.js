// repositories/productsRepository.js

// import productsMongoDAO from '../dataAccess/productsMongoDAO.js';

// const productsRepository = {};

// productsRepository.getAllProducts = async (page, limit) => {
//     return await productsMongoDAO.getAllProducts(page, limit);
// };

// productsRepository.createProduct = async (productData) => {
//     return await productsMongoDAO.createProduct(productData);
// };

// export default productsRepository;

import Product from '../models/product.model.js';

const productsMongoRepository = {};

productsMongoRepository.getAllProducts = async (page, limit) => {
    const options = {
        page: page,
        limit: limit
    };
    return await Product.paginate({}, options);
};

productsMongoRepository.getProductById = async (productId) => {
    return await Product.findById(productId);
};

export default productsMongoRepository;
