import fs  from 'fs';
import { promisify } from 'util';

const readdir = promisify(fs.readdir);

export const fileSystemConfig = () => {
    console.log("Configurando el sistema de archivos...");

    // Implementa la configuración específica para FileSystem aquí
    // Por ejemplo, verifica si el directorio de productos existe, si no, créalo, etc.
};
