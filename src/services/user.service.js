import User from '../models/user.model.js';

const uploadDocuments = async (userId, files) => {
    if (!files || files.length === 0) {
        throw new Error("No se subieron archivos");
    }

    const user = await User.findById(userId);
    if (!user) {
        throw new Error("Usuario no encontrado");
    }

    files.forEach(file => {
        user.documents.push({
            name: file.originalname,
            reference: file.path
        });
    });

    await user.save();
    return user.documents;
};

export default uploadDocuments