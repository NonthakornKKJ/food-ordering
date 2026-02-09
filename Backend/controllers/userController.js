import User from '../models/User.js';

// Get all users (Admin only)
export const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        next(error);
    }
};

// Get user by ID (Admin only)
export const getUserById = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.json(user);
    } catch (error) {
        next(error);
    }
};

// Create new user (Admin only)
export const createUser = async (req, res, next) => {
    try {
        const { username, password, role, tableNumber } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required.' });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists.' });
        }

        const user = new User({
            username,
            password,
            role: role || 'customer',
            tableNumber
        });

        await user.save();

        res.status(201).json({
            message: 'User created successfully',
            user: {
                id: user._id,
                username: user.username,
                role: user.role,
                tableNumber: user.tableNumber
            }
        });
    } catch (error) {
        next(error);
    }
};

// Update user (Admin only)
export const updateUser = async (req, res, next) => {
    try {
        const { username, password, role, tableNumber, isActive } = req.body;

        const updateData = { username, role, tableNumber, isActive };

        // Only update password if provided
        if (password) {
            const bcrypt = await import('bcryptjs');
            updateData.password = await bcrypt.default.hash(password, 10);
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.json({
            message: 'User updated successfully',
            user
        });
    } catch (error) {
        next(error);
    }
};

// Delete user (Admin only)
export const deleteUser = async (req, res, next) => {
    try {
        // Prevent deleting yourself
        if (req.params.id === req.user._id.toString()) {
            return res.status(400).json({ message: 'Cannot delete your own account.' });
        }

        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        next(error);
    }
};
