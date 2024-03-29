import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2'

const collectionName = 'Productos';
const stringTypeSchemaUniqueRequired = {
    type: String,
    unique: true,
    required: true
};

const stringTypeSchemaNonUniqueRequired = {
    type: String,
    required: true
};


const productScheme = new mongoose.Schema({
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

productScheme.plugin(mongoosePaginate)

const productsModel = mongoose.model(collectionName, productScheme);
export default productsModel;