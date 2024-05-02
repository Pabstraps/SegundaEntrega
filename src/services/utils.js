import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt';

//Hasheo de password
export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (storedPassword, enteredPassword) => {
    if (!storedPassword || !enteredPassword) {
        return false;
    }
    console.log(`Datos a validar: storedPassword: ${storedPassword}, enteredPassword: ${enteredPassword}`);
    return bcrypt.compareSync(enteredPassword, storedPassword);
};



const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);



export default __dirname;