import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Verify JWT Token
export const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Access denied. No token provided.' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // If token belongs to a real user (has userId), load from DB
        if (decoded.userId) {
            const user = await User.findById(decoded.userId).select('-password');
            if (!user) {
                return res.status(401).json({ message: 'Invalid token. User not found.' });
            }
            req.user = user;
        } else if (decoded.tableNumber) {
            // Token issued via QR login for a table/customer - attach a lightweight user object
            req.user = {
                role: decoded.role || 'customer',
                tableNumber: decoded.tableNumber,
                isTemporary: true,
            };
        } else {
            return res.status(401).json({ message: 'Invalid token.' });
        }
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token.' });
    }
};

// Check if user is Admin
export const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    next();
};

// Check if user is Kitchen staff
export const isKitchen = (req, res, next) => {
    if (req.user.role !== 'kitchen' && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Kitchen staff only.' });
    }
    next();
};

// Check if user is Customer
export const isCustomer = (req, res, next) => {
    if (req.user.role !== 'customer' && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Customer only.' });
    }
    next();
};
