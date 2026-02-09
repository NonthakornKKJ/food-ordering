import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { orderAPI } from '../../services/api';
import Navbar from '../../components/Navbar';

const CartPage = () => {
    const { items, updateQuantity, removeItem, clearCart, totalPrice } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmitOrder = async () => {
        if (items.length === 0) return;

        setLoading(true);
        setError('');

        try {
            await orderAPI.create({
                tableNumber: user.tableNumber,
                items: items.map(item => ({
                    menuId: item.menuId,
                    quantity: item.quantity,
                    note: item.note
                }))
            });

            clearCart();
            navigate('/orders');
        } catch (err) {
            setError(err.response?.data?.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-3xl mx-auto px-4 py-6">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">🛒 ตะกร้าสินค้า</h1>
                    <p className="text-gray-500">โต๊ะ {user?.tableNumber}</p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-4">
                        {error}
                    </div>
                )}

                {items.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                        <div className="text-6xl mb-4">🛒</div>
                        <h2 className="text-xl font-semibold text-gray-700 mb-2">ตะกร้าว่างเปล่า</h2>
                        <p className="text-gray-500 mb-6">ยังไม่มีรายการอาหารในตะกร้า</p>
                        <button
                            onClick={() => navigate('/menu')}
                            className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition"
                        >
                            ดูเมนูอาหาร
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Cart Items */}
                        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
                            {items.map((item, index) => (
                                <div
                                    key={item.menuId}
                                    className={`p-4 flex items-center gap-4 ${index !== items.length - 1 ? 'border-b' : ''
                                        }`}
                                >
                                    {/* Image */}
                                    <div className="w-20 h-20 bg-orange-100 rounded-xl flex items-center justify-center text-3xl flex-shrink-0">
                                        {item.image ? (
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-xl" />
                                        ) : (
                                            '🍴'
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-gray-800 truncate">{item.name}</h3>
                                        <p className="text-orange-600 font-medium">฿{item.price}</p>
                                    </div>

                                    {/* Quantity */}
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => updateQuantity(item.menuId, item.quantity - 1)}
                                            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition"
                                        >
                                            -
                                        </button>
                                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.menuId, item.quantity + 1)}
                                            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition"
                                        >
                                            +
                                        </button>
                                    </div>

                                    {/* Subtotal */}
                                    <div className="text-right w-20">
                                        <p className="font-bold text-gray-800">฿{item.price * item.quantity}</p>
                                    </div>

                                    {/* Remove */}
                                    <button
                                        onClick={() => removeItem(item.menuId)}
                                        className="text-red-500 hover:text-red-600 transition"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Summary */}
                        <div className="bg-white rounded-2xl shadow-sm p-6">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-gray-600">รวมทั้งหมด</span>
                                <span className="text-2xl font-bold text-orange-600">฿{totalPrice}</span>
                            </div>

                            <button
                                onClick={handleSubmitOrder}
                                disabled={loading}
                                className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl font-medium text-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        กำลังส่งออเดอร์...
                                    </span>
                                ) : (
                                    '✓ ยืนยันสั่งอาหาร'
                                )}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default CartPage;
