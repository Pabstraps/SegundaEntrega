// models/product.mongo.dao.js
import Product from './product.model.js';

class ProductsMongoDAO {
    async getAllProducts() {
        try {
            return await Product.find();
        } catch (error) {
            throw new Error(`Error al leer productos desde MongoDB: ${error}`);
        }
    }

    async addProduct(productData) {
        try {
            const product = new Product(productData);
            return await product.save();
        } catch (error) {
            throw new Error(`Error al agregar producto en MongoDB: ${error}`);
        }
    }
}

export default new ProductsMongoDAO();
