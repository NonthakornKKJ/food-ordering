import Menu from '../models/Menu.js';

// Get all menus
export const getAllMenus = async (req, res, next) => {
    try {
        const { category, available } = req.query;
        let query = {};

        if (category) {
            query.category = category;
        }
        if (available !== undefined) {
            query.isAvailable = available === 'true';
        }

        const menus = await Menu.find(query).populate('category', 'name');
        res.json(menus);
    } catch (error) {
        next(error);
    }
};

// Get menu by ID
export const getMenuById = async (req, res, next) => {
    try {
        const menu = await Menu.findById(req.params.id).populate('category', 'name');
        if (!menu) {
            return res.status(404).json({ message: 'Menu not found.' });
        }
        res.json(menu);
    } catch (error) {
        next(error);
    }
};

// Create new menu (Admin only)
export const createMenu = async (req, res, next) => {
    try {
        const { name, description, price, image, category, isAvailable } = req.body;

        if (!name || !price || !category) {
            return res.status(400).json({ message: 'Name, price, and category are required.' });
        }

        const menu = new Menu({
            name,
            description,
            price,
            image,
            category,
            isAvailable: isAvailable !== undefined ? isAvailable : true
        });

        await menu.save();
        await menu.populate('category', 'name');

        res.status(201).json({
            message: 'Menu created successfully',
            menu
        });
    } catch (error) {
        next(error);
    }
};

// Update menu (Admin only)
export const updateMenu = async (req, res, next) => {
    try {
        const { name, description, price, image, category, isAvailable } = req.body;

        const menu = await Menu.findByIdAndUpdate(
            req.params.id,
            { name, description, price, image, category, isAvailable },
            { new: true, runValidators: true }
        ).populate('category', 'name');

        if (!menu) {
            return res.status(404).json({ message: 'Menu not found.' });
        }

        res.json({
            message: 'Menu updated successfully',
            menu
        });
    } catch (error) {
        next(error);
    }
};

// Delete menu (Admin only)
export const deleteMenu = async (req, res, next) => {
    try {
        const menu = await Menu.findByIdAndDelete(req.params.id);
        if (!menu) {
            return res.status(404).json({ message: 'Menu not found.' });
        }

        res.json({ message: 'Menu deleted successfully' });
    } catch (error) {
        next(error);
    }
};
