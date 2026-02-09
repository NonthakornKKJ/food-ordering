import Order from '../models/Order.js';
import Menu from '../models/Menu.js';

// Create new order (Customer)
export const createOrder = async (req, res, next) => {
    try {
        const { tableNumber, items } = req.body;

        if (!tableNumber || !items || items.length === 0) {
            return res.status(400).json({ message: 'Table number and items are required.' });
        }

        // Validate items and calculate total price
        let totalPrice = 0;
        const orderItems = [];

        for (const item of items) {
            const menu = await Menu.findById(item.menuId);
            if (!menu) {
                return res.status(400).json({ message: `Menu item ${item.menuId} not found.` });
            }
            if (!menu.isAvailable) {
                return res.status(400).json({ message: `${menu.name} is not available.` });
            }

            const quantity = item.quantity || 1;
            totalPrice += menu.price * quantity;

            orderItems.push({
                menuId: menu._id,
                name: menu.name,
                price: menu.price,
                quantity,
                note: item.note || ''
            });
        }

        const order = new Order({
            tableNumber,
            items: orderItems,
            totalPrice,
            status: 'pending'
        });

        await order.save();

        res.status(201).json({
            message: 'Order created successfully',
            order
        });
    } catch (error) {
        next(error);
    }
};

// Get orders by table number
export const getOrdersByTable = async (req, res, next) => {
    try {
        const { tableNumber } = req.params;
        const { status } = req.query;

        let query = { tableNumber: parseInt(tableNumber) };
        if (status) {
            query.status = status;
        }

        const orders = await Order.find(query).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        next(error);
    }
};

// Get all orders (Kitchen/Admin)
export const getAllOrders = async (req, res, next) => {
    try {
        const { status, tableNumber } = req.query;
        let query = {};

        if (status) {
            query.status = status;
        }
        if (tableNumber) {
            query.tableNumber = parseInt(tableNumber);
        }

        const orders = await Order.find(query).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        next(error);
    }
};

// Get order by ID
export const getOrderById = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found.' });
        }
        res.json(order);
    } catch (error) {
        next(error);
    }
};

// Update order status (Kitchen)
export const updateOrderStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const validStatuses = ['pending', 'cooking', 'completed'];

        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({
                message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
            });
        }

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({ message: 'Order not found.' });
        }

        res.json({
            message: 'Order status updated successfully',
            order
        });
    } catch (error) {
        next(error);
    }
};

// Delete order (Admin only)
export const deleteOrder = async (req, res, next) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found.' });
        }

        res.json({ message: 'Order deleted successfully' });
    } catch (error) {
        next(error);
    }
};
