import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';

//Hasheo de password
export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (storedPassword, enteredPassword) => {
    if (!storedPassword || !enteredPassword) {
        return false;
    }
    console.log(`Datos a validar: storedPassword: ${storedPassword}, enteredPassword: ${enteredPassword}`);
    return bcrypt.compareSync(enteredPassword, storedPassword);
};



export const generateProduct = () => {
    return {
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        code: faker.commerce.isbn(),
        price: faker.commerce.price(),
        stock: faker.random.numeric(1),
        category: faker.commerce.department(),
        id: faker.database.mongodbObjectId(),
        image: faker.image.image()
    }
};






const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);



export default __dirname;

