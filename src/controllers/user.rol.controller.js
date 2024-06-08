import User from '../models/user.model.js';

export const toggleUserRole = async (req, res) => {
    const { uid } = req.params;

    try {
        const user = await User.findById(uid);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.role = user.role === 'user' ? 'premium' : 'user';
        await user.save();

        res.status(200).json({ message: `User role updated to ${user.role}` });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
