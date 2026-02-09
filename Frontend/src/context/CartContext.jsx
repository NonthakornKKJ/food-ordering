import { createContext, useContext, useState } from 'react';

const CartContext = createContext(null);

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [items, setItems] = useState([]);

    const addItem = (menu, quantity = 1, note = '') => {
        setItems(prev => {
            const existingIndex = prev.findIndex(item => item.menuId === menu._id);

            if (existingIndex >= 0) {
                const updated = [...prev];
                updated[existingIndex].quantity += quantity;
                return updated;
            }

            return [...prev, {
                menuId: menu._id,
                name: menu.name,
                price: menu.price,
                quantity,
                note,
                image: menu.image
            }];
        });
    };

    const updateQuantity = (menuId, quantity) => {
        if (quantity <= 0) {
            removeItem(menuId);
            return;
        }

        setItems(prev =>
            prev.map(item =>
                item.menuId === menuId
                    ? { ...item, quantity }
                    : item
            )
        );
    };

    const removeItem = (menuId) => {
        setItems(prev => prev.filter(item => item.menuId !== menuId));
    };

    const clearCart = () => {
        setItems([]);
    };

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const value = {
        items,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        totalItems,
        totalPrice,
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};
