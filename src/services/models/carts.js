import mongoose from 'mongoose';

const collectionName = 'Cart';

const stringTypeSchemaNonUniqueRequired = {
    type: String,
    required: true
};

const CartScheme = new mongoose.Schema({
    title: stringTypeSchemaNonUniqueRequired,
    description: stringTypeSchemaNonUniqueRequired,
    code: stringTypeSchemaNonUniqueRequired,
    price: stringTypeSchemaNonUniqueRequired,
    stock: stringTypeSchemaNonUniqueRequired,
    category: {
        type: "string",
        enum: ["software","hardware","accesories"],
    },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }] // Referencia a los productos completos
});

export const cartsModel = mongoose.model(collectionName, CartScheme);
