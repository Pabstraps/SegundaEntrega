import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    code: { type: String, required: true },
    price: { type: String, required: true },
    stock: { type: String, required: true },
    category: {
        type: String,
        enum: ["software","hardware","accesories"],
    },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
});

const cartsModel = mongoose.model('Cart', cartSchema);

export default cartsModel;
