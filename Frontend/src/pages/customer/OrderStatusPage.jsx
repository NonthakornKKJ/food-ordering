import { useState, useEffect } from 'react';
import { orderAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import OrderCard from '../../components/OrderCard';

const OrderStatusPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        fetchOrders();
        // Refresh every 10 seconds
        const interval = setInterval(fetchOrders, 10000);
        return () => clearInterval(interval);
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await orderAPI.getByTable(user.tableNumber);
            setOrders(response.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const pendingOrders = orders.filter(o => o.status === 'pending');
    const cookingOrders = orders.filter(o => o.status === 'cooking');
    const completedOrders = orders.filter(o => o.status === 'completed');

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="flex items-center justify-center h-[calc(100vh-64px)]">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-4xl mx-auto px-4 py-6">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">📋 สถานะออเดอร์</h1>
                    <p className="text-gray-500">โต๊ะ {user?.tableNumber} • รีเฟรชอัตโนมัติทุก 10 วินาที</p>
                </div>

                {orders.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                        <div className="text-6xl mb-4">📋</div>
                        <h2 className="text-xl font-semibold text-gray-700 mb-2">ยังไม่มีออเดอร์</h2>
                        <p className="text-gray-500">เริ่มสั่งอาหารจากเมนูได้เลย</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Pending Orders */}
                        {pendingOrders.length > 0 && (
                            <div>
                                <h2 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
                                    <span className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></span>
                                    รอดำเนินการ ({pendingOrders.length})
                                </h2>
                                <div className="space-y-4">
                                    {pendingOrders.map(order => (
                                        <OrderCard key={order._id} order={order} showActions={false} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Cooking Orders */}
                        {cookingOrders.length > 0 && (
                            <div>
                                <h2 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
                                    <span className="w-3 h-3 bg-blue-400 rounded-full mr-2 animate-pulse"></span>
                                    กำลังปรุง ({cookingOrders.length})
                                </h2>
                                <div className="space-y-4">
                                    {cookingOrders.map(order => (
                                        <OrderCard key={order._id} order={order} showActions={false} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Completed Orders */}
                        {completedOrders.length > 0 && (
                            <div>
                                <h2 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
                                    <span className="w-3 h-3 bg-green-400 rounded-full mr-2"></span>
                                    เสร็จสิ้น ({completedOrders.length})
                                </h2>
                                <div className="space-y-4">
                                    {completedOrders.map(order => (
                                        <OrderCard key={order._id} order={order} showActions={false} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderStatusPage;
