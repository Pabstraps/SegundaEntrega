// product.fs.dao.js
import fs from 'fs';
import { join } from 'path';

const filePath = join(process.cwd(), 'data', 'products.json');

export const ProductFS_DAO = {
    getAllProducts: async () => {
        try {
            const productsData = await fs.promises.readFile(filePath, 'utf-8');
            return JSON.parse(productsData);
        } catch (error) {
            throw new Error(`Could not read products file: ${error}`);
        }
    },

    addProduct: async (product) => {
        try {
            const productsData = await fs.promises.readFile(filePath, 'utf-8');
            const products = JSON.parse(productsData);
            products.push(product);
            await fs.promises.writeFile(filePath, JSON.stringify(products, null, 2));
        } catch (error) {
            throw new Error(`Could not add product: ${error}`);
        }
    }
};

