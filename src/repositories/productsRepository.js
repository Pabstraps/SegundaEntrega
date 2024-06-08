// repositories/productsRepository.js

import productsMongoDAO from '../dataAccess/productsMongoDAO.js';

const productsRepository = {};

productsRepository.getAllProducts = async (page, limit) => {
    return await productsMongoDAO.getAllProducts(page, limit);
};

productsRepository.createProduct = async (productData) => {
    console.log("Datos del producto en el repositorio:", productData); 
    return await productsMongoDAO.createProduct(productData);
};

export default productsRepository;
