import Order from '../models/Order.js';
import Menu from '../models/Menu.js';
import Category from '../models/Category.js';
import User from '../models/User.js';

// Get dashboard statistics (Admin only)
export const getDashboardStats = async (req, res, next) => {
    try {
        // Get counts
        const totalOrders = await Order.countDocuments();
        const pendingOrders = await Order.countDocuments({ status: 'pending' });
        const cookingOrders = await Order.countDocuments({ status: 'cooking' });
        const completedOrders = await Order.countDocuments({ status: 'completed' });

        const totalMenus = await Menu.countDocuments();
        const availableMenus = await Menu.countDocuments({ isAvailable: true });

        const totalCategories = await Category.countDocuments();
        const totalUsers = await User.countDocuments();

        // Get today's orders
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayOrders = await Order.find({ createdAt: { $gte: today } });

        const todayOrderCount = todayOrders.length;
        const todayRevenue = todayOrders.reduce((sum, order) => sum + order.totalPrice, 0);

        // Get recent orders
        const recentOrders = await Order.find()
            .sort({ createdAt: -1 })
            .limit(10);

        // Get popular menu items (by order frequency)
        const popularItems = await Order.aggregate([
            { $unwind: '$items' },
            { $group: { _id: '$items.menuId', name: { $first: '$items.name' }, count: { $sum: '$items.quantity' } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);

        res.json({
            orders: {
                total: totalOrders,
                pending: pendingOrders,
                cooking: cookingOrders,
                completed: completedOrders,
                today: todayOrderCount,
                todayRevenue
            },
            menus: {
                total: totalMenus,
                available: availableMenus
            },
            categories: {
                total: totalCategories
            },
            users: {
                total: totalUsers
            },
            recentOrders,
            popularItems
        });
    } catch (error) {
        next(error);
    }
};
