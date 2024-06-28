import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const { Schema } = mongoose;

const userSchema = new Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    age: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: ['user', 'premium', 'admin'],
        default: "user"
    },
    documents: [{
        name: {
            type: String,
        },
        reference:{
            type: String
        }
    }],

    last_connection: {
        type: Date,
        default: null
    }

}, { timestamps: true });

// Método para comparar contraseñas
userSchema.methods.isValidPassword = async function(password) {
    return bcrypt.compare(password, this.password);
};

// Middleware para hashear la contraseña antes de guardarla en la base de datos
userSchema.pre('save', async function(next) {
    const user = this;
    if (!user.isModified('password')) return next();

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    user.password = hashedPassword;
    next();
});

const User = mongoose.model('User', userSchema);

export default User;
