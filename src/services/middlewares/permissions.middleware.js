// middlewares/permissions.js
import Product from '../../models/product.model.js';

export const checkProductOwnership = async (req, res, next) => {
    const productId = req.params.id;
    const user = req.user;

    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (user.role === 'admin' || product.owner === user.email) {
            return next();
        }

        return res.status(403).json({ message: 'Permission denied' });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

