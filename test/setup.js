import express from 'express';
import productsRouter from '../src/routes/products.routes.js';

const app = express();

// Middlewares y configuración
app.use(express.json());
app.use('/api/products', productsRouter);

export default app;
