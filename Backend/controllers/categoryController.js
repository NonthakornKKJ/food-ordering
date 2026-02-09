import Category from '../models/Category.js';
import Menu from '../models/Menu.js';

// Get all categories
export const getAllCategories = async (req, res, next) => {
    try {
        const { active } = req.query;
        let query = {};

        if (active !== undefined) {
            query.isActive = active === 'true';
        }

        const categories = await Category.find(query);
        res.json(categories);
    } catch (error) {
        next(error);
    }
};

// Get category by ID
export const getCategoryById = async (req, res, next) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found.' });
        }
        res.json(category);
    } catch (error) {
        next(error);
    }
};

// Create new category (Admin only)
export const createCategory = async (req, res, next) => {
    try {
        const { name, description, isActive } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Category name is required.' });
        }

        const category = new Category({
            name,
            description,
            isActive: isActive !== undefined ? isActive : true
        });

        await category.save();

        res.status(201).json({
            message: 'Category created successfully',
            category
        });
    } catch (error) {
        next(error);
    }
};

// Update category (Admin only)
export const updateCategory = async (req, res, next) => {
    try {
        const { name, description, isActive } = req.body;

        const category = await Category.findByIdAndUpdate(
            req.params.id,
            { name, description, isActive },
            { new: true, runValidators: true }
        );

        if (!category) {
            return res.status(404).json({ message: 'Category not found.' });
        }

        res.json({
            message: 'Category updated successfully',
            category
        });
    } catch (error) {
        next(error);
    }
};

// Delete category (Admin only)
export const deleteCategory = async (req, res, next) => {
    try {
        // Check if category has menus
        const menuCount = await Menu.countDocuments({ category: req.params.id });
        if (menuCount > 0) {
            return res.status(400).json({
                message: `Cannot delete category. ${menuCount} menu(s) are using this category.`
            });
        }

        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found.' });
        }

        res.json({ message: 'Category deleted successfully' });
    } catch (error) {
        next(error);
    }
};
