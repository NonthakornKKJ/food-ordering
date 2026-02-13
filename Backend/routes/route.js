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
router.post('/api/auth/login', login);
router.post('/api/auth/qr-login', loginWithQR);
router.post('/api/auth/register', verifyToken, isAdmin, register);
router.get('/api/auth/me', verifyToken, getMe);

// ==================== MENU ROUTES ====================
router.get('/api/menus', verifyToken, getAllMenus);
router.get('/api/menus/:id', verifyToken, getMenuById);
router.post('/api/menus', verifyToken, isAdmin, createMenu);
router.put('/api/menus/:id', verifyToken, isAdmin, updateMenu);
router.delete('/api/menus/:id', verifyToken, isAdmin, deleteMenu);

// ==================== CATEGORY ROUTES ====================
router.get('/api/categories', verifyToken, getAllCategories);
router.get('/api/categories/:id', verifyToken, getCategoryById);
router.post('/api/categories', verifyToken, isAdmin, createCategory);
router.put('/api/categories/:id', verifyToken, isAdmin, updateCategory);
router.delete('/api/categories/:id', verifyToken, isAdmin, deleteCategory);

// ==================== ORDER ROUTES ====================
router.post('/api/orders', verifyToken, createOrder);
router.get('/api/orders', verifyToken, isKitchen, getAllOrders);
router.get('/api/orders/table/:tableNumber', verifyToken, getOrdersByTable);
router.get('/api/orders/:id', verifyToken, getOrderById);
router.patch('/api/orders/:id/status', verifyToken, isKitchen, updateOrderStatus);
router.delete('/api/orders/:id', verifyToken, isAdmin, deleteOrder);

// ==================== USER ROUTES (Admin only) ====================
router.get('/api/users', verifyToken, isAdmin, getAllUsers);
router.get('/api/users/:id', verifyToken, isAdmin, getUserById);
router.post('/api/users', verifyToken, isAdmin, createUser);
router.put('/api/users/:id', verifyToken, isAdmin, updateUser);
router.delete('/api/users/:id', verifyToken, isAdmin, deleteUser);

// ==================== DASHBOARD ROUTES (Admin only) ====================
router.get('/api/dashboard', verifyToken, isAdmin, getDashboardStats);

// ==================== TABLE ROUTES (Admin only) ====================
router.get('/api/tables', verifyToken, isAdmin, getAllTables);

// Health check
router.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

router.get("/api/debug-users", async (req, res) => {
    const users = await User.find();
    res.json(users);
});

export default router;