import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    code: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    category: {
        type: String,
        enum: ["software","hardware","accesories"],
    },
});

const cartSchema = new mongoose.Schema({
    title: { type: String, required: true },
    products: [productSchema]
});

const cartsModel = mongoose.model('Cart', cartSchema);

export default cartsModel;
