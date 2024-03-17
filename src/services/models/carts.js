import mongoose from 'mongoose';

const collectionName = 'Cart';

const stringTypeSchemaUniqueRequired = {
    type: String,
    unique: true,
    required: true
};

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
    }
});

export const cartsModel = mongoose.model(collectionName, CartScheme);