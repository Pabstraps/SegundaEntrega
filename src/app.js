import express from 'express';
import __dirname from '../src/utils.js'
import productsRoutes from '../src/routes/products.routes.js'
import cartsRoutes from '../src/routes/carts.routes.js'
import usersViewRoutes from './routes/users.view.routes.js';
import sessionsRoutes from './routes/sessions.routes.js' 
import handlebars from 'express-handlebars';
import mongoose from 'mongoose'
import mongoStore from 'connect-mongo'
import session from 'express-session'
import viewsRoutes from '../src/routes/views.routes.js';
import passport from 'passport';
import initializePassport from './config/passport.config.js';
import productsModel from './services/models/products.js';

const MONGO_URL = "mongodb+srv://pablozg24:Admin@cluster0.7revplc.mongodb.net/Ecommerce?retryWrites=true&w=majority&appName=Cluster0'"

const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.engine('handlebars',handlebars.engine());
app.set('views',__dirname+'/views');
app.set('view engine','handlebars');
app.use(express.static(__dirname+'/public'))

app.use(session({
    store: mongoStore.create({
        mongoUrl: MONGO_URL,
        mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
        ttl: 10 * 20
    }),
    secret:"coderS3cr3t",
    resave: false,
    saveUninitialized: true,
}))

app.use("/views", viewsRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/cart", cartsRoutes);
app.use("/users", usersViewRoutes);
app.use("/api/sessions", sessionsRoutes);


initializePassport();
app.use(passport.initialize());
app.use(passport.session());



const SERVER_PORT = 8080;
app.listen(8080, () => {
    console.log("Servidor escuchando por el puerto: " + SERVER_PORT);
});

const connectMongoDB = async ()=>{
    try {
        await mongoose.connect(MONGO_URL);
        console.log("Conectado con exito a MongoDB usando Moongose.");

        let products = await productsModel.paginate({ productsModel }, { limit: 5, page: 3})
        console.log (products)

    } catch (error) {
        console.error("No se pudo conectar a la BD usando Moongose: " + error);
        process.exit();
    }
};

connectMongoDB();


