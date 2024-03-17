import express from 'express';
import __dirname from '../src/utils.js'
import productsRoutes from '../src/routes/products.routes.js'
import cartsRoutes from '../src/routes/carts.routes.js'
import handlebars from 'express-handlebars';
import mongoose from 'mongoose'
import viewsRoutes from '../src/routes/views.routes.js'; 

import productsModel from './services/models/products.js';


const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.engine('handlebars',handlebars.engine());
app.set('views',__dirname+'/views');
app.set('view engine','handlebars');
app.use(express.static(__dirname+'/public'))


app.use("/views", viewsRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/cart", cartsRoutes);

const SERVER_PORT = 8080;
app.listen(8080, () => {
    console.log("Servidor escuchando por el puerto: " + SERVER_PORT);
});

const connectMongoDB = async ()=>{
    try {
        await mongoose.connect('mongodb+srv://pablozg24:Admin@cluster0.7revplc.mongodb.net/Ecommerce?retryWrites=true&w=majority&appName=Cluster0');
        console.log("Conectado con exito a MongoDB usando Moongose.");

        let products = await productsModel.paginate({ productsModel }, { limit: 5, page: 3})
        console.log (products)

    } catch (error) {
        console.error("No se pudo conectar a la BD usando Moongose: " + error);
        process.exit();
    }
};

connectMongoDB();




// app.get('/ping', (req, res) => {
//     console.log(__dirname);
//     res.send({ status: "ok" })
// })
// app.listen(PORT, () => {
//     console.log(`Server run on port ${PORT}`);
// })
