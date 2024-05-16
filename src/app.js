import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import session from 'express-session';
import mongoStore from 'connect-mongo';
import passport from 'passport';
import handlebars from 'express-handlebars';
import productsRoutes from './routes/products.routes.js';
import cartsRoutes from './routes/carts.routes.js';
import usersViewRoutes from './routes/users.view.routes.js';
import sessionsRoutes from './routes/sessions.routes.js';
import githubloginViewRouter from './routes/github-login.views.routes.js';
import viewsRoutes from './routes/views.routes.js';
import mockingProducts from './routes/products.mocking.routes.js'
import initializePassport from '../src/services/config/passport.config.js';
import productsModel from '../src/models/product.model.js'
import { fileSystemConfig } from './config/fileSystem.config.js';


import { addLogger } from './config/loggerCustom.js';



const app = express();
const MONGO_URL = "mongodb+srv://pablozg24:Admin@cluster0.7revplc.mongodb.net/Ecommerce?retryWrites=true&w=majority&appName=Cluster0";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', handlebars.engine());
app.set('views', path.join(path.resolve(), 'src', 'views'));
app.set('view engine', 'handlebars');
app.use(express.static(path.join(path.resolve(), 'src', 'public')));


app.use(addLogger);

app.use(session({
    store: mongoStore.create({
        mongoUrl: MONGO_URL,
        mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
        ttl: 10 * 20
    }),
    secret: "coderS3cr3t",
    resave: false,
    saveUninitialized: true,
}));

app.use("/views", viewsRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/cart", cartsRoutes);
app.use("/users", usersViewRoutes);
app.use("/api/sessions", sessionsRoutes);
app.use("/github", githubloginViewRouter);
app.use("/",mockingProducts)

app.get("/loggerTest", (req, res) => {
    req.logger.warning("Prueba de log level warning --> en Endpoint"); // **CUSTOM
    res.send("Prueba de logger!");
});

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

const SERVER_PORT = 8080;
app.listen(SERVER_PORT, () => {
    console.log("Servidor escuchando por el puerto: " + SERVER_PORT);
});

const DB_TYPE = process.argv[2] || 'MONGO'; // Obtener el tipo de base de datos desde los argumentos de la línea de comandos

if (DB_TYPE === 'MONGO') {
    // Configuración para MongoDB
    
    const MONGO_URL = "mongodb+srv://pablozg24:Admin@cluster0.7revplc.mongodb.net/Ecommerce?retryWrites=true&w=majority&appName=Cluster0";
    mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => console.log("Conectado con éxito a MongoDB"))
        .catch(error => console.error("No se pudo conectar a MongoDB: " + error));

    app.use("/api/products", productsRoutes);
} else if (DB_TYPE === 'FILESYSTEM') {
    // Configuración para FileSystem
    fileSystemConfig(); // Configuración específica para FileSystem
    
    app.use("/api/products", productsRoutes);
} else {
    console.error("Tipo de base de datos no válido. Use 'MONGO' o 'FILESYSTEM'.");
    process.exit(1);
}