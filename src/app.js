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
import initializePassport from '../src/services/config/passport.config.js';

const app = express();
const MONGO_URL = "mongodb+srv://pablozg24:Admin@cluster0.7revplc.mongodb.net/Ecommerce?retryWrites=true&w=majority&appName=Cluster0'";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', handlebars.engine());
app.set('views', path.join(path.resolve(), 'src', 'views'));
app.set('view engine', 'handlebars');
app.use(express.static(path.join(path.resolve(), 'src', 'public')));


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

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

const SERVER_PORT = 8080;
app.listen(SERVER_PORT, () => {
    console.log("Servidor escuchando por el puerto: " + SERVER_PORT);
});

const connectMongoDB = async () => {
    try {
        await mongoose.connect(MONGO_URL);
        console.log("Conectado con exito a MongoDB usando Moongose.");
    } catch (error) {
        console.error("No se pudo conectar a la BD usando Moongose: " + error);
        process.exit();
    }
};

connectMongoDB();
