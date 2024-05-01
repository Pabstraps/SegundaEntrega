import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const productsFilePath = path.join(__dirname, '../data/products.json');

const productsFileSystemDAO = {};

productsFileSystemDAO.getAllProducts = async () => {
    try {
        const data = await fs.promises.readFile(productsFilePath);
        return JSON.parse(data);
    } catch (error) {
        console.error("No se pudo obtener productos del sistema de archivos: " + error);
        throw new Error("No se pudo obtener productos del sistema de archivos");
    }
};

productsFileSystemDAO.createProduct = async (product) => {
    try {
        let products = await productsFileSystemDAO.getAllProducts();
        products.push(product);
        await fs.promises.writeFile(productsFilePath, JSON.stringify(products, null, 2));
        return product;
    } catch (error) {
        console.error("No se pudo crear el producto en el sistema de archivos: " + error);
        throw new Error("No se pudo crear el producto en el sistema de archivos");
    }
};

export default productsFileSystemDAO;
