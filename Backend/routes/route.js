import express from 'express';
import { verifyToken, isAdmin, isKitchen } from '../middlewares/auth.js';

// Controllers
import { login, loginWithQR, register, getMe } from '../controllers/authController.js';
import { getAllMenus, getMenuById, createMenu, updateMenu, deleteMenu } from '../controllers/menuController.js';
import { getAllCategories, getCategoryById, createCategory, updateCategory, deleteCategory } from '../controllers/categoryController.js';
import { createOrder, getOrdersByTable, getAllOrders, getOrderById, updateOrderStatus, deleteOrder } from '../controllers/orderController.js';
import { getAllUsers, getUserById, createUser, updateUser, deleteUser } from '../controllers/userController.js';
import { getDashboardStats } from '../controllers/dashboardController.js';
import { getAllTables } from '../controllers/tableController.js';

const router = express.Router();

// ==================== AUTH ROUTES ====================
// ==================== AUTH ROUTES ====================
router.post('/auth/login', login);
router.post('/auth/qr-login', loginWithQR);
router.post('/auth/register', verifyToken, isAdmin, register);
router.get('/auth/me', verifyToken, getMe);

// ==================== MENU ROUTES ====================
router.get('/menus', verifyToken, getAllMenus);
router.get('/menus/:id', verifyToken, getMenuById);
router.post('/menus', verifyToken, isAdmin, createMenu);
router.put('/menus/:id', verifyToken, isAdmin, updateMenu);
router.delete('/menus/:id', verifyToken, isAdmin, deleteMenu);

// ==================== CATEGORY ROUTES ====================
router.get('/categories', verifyToken, getAllCategories);
router.get('/categories/:id', verifyToken, getCategoryById);
router.post('/categories', verifyToken, isAdmin, createCategory);
router.put('/categories/:id', verifyToken, isAdmin, updateCategory);
router.delete('/categories/:id', verifyToken, isAdmin, deleteCategory);

// ==================== ORDER ROUTES ====================
router.post('/orders', verifyToken, createOrder);
router.get('/orders', verifyToken, isKitchen, getAllOrders);
router.get('/orders/table/:tableNumber', verifyToken, getOrdersByTable);
router.get('/orders/:id', verifyToken, getOrderById);
router.patch('/orders/:id/status', verifyToken, isKitchen, updateOrderStatus);
router.delete('/orders/:id', verifyToken, isAdmin, deleteOrder);

// ==================== USER ROUTES ====================
router.get('/users', verifyToken, isAdmin, getAllUsers);
router.get('/users/:id', verifyToken, isAdmin, getUserById);
router.post('/users', verifyToken, isAdmin, createUser);
router.put('/users/:id', verifyToken, isAdmin, updateUser);
router.delete('/users/:id', verifyToken, isAdmin, deleteUser);

// ==================== DASHBOARD ====================
router.get('/dashboard', verifyToken, isAdmin, getDashboardStats);

// ==================== TABLE ====================
router.get('/tables', verifyToken, isAdmin, getAllTables);

// Health check
router.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Debug
router.get('/debug-users', async (req, res) => {
    const users = await User.find();
    res.json(users);
});

export default router;