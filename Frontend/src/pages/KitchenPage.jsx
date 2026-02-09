import { useState, useEffect } from 'react';
import { orderAPI } from '../services/api';
import Navbar from '../components/Navbar';
import OrderCard from '../components/OrderCard';

const KitchenPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('active'); // 'active', 'pending', 'cooking', 'completed'

    useEffect(() => {
        fetchOrders();
        // Refresh every 5 seconds
        const interval = setInterval(fetchOrders, 5000);
        return () => clearInterval(interval);
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await orderAPI.getAll();
            setOrders(response.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (orderId, status) => {
        try {
            await orderAPI.updateStatus(orderId, status);
            fetchOrders();
        } catch (error) {
            console.error('Error updating order:', error);
        }
    };

    const filteredOrders = orders.filter(order => {
        if (filter === 'active') return order.status !== 'completed';
        return order.status === filter;
    });

    const pendingCount = orders.filter(o => o.status === 'pending').length;
    const cookingCount = orders.filter(o => o.status === 'cooking').length;

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

            <div className="flex flex-col items-center justify-center">
                <div className="w-full max-w-6xl px-4 py-6">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">👨‍🍳 ครัว</h1>
                            <p className="text-gray-500">รีเฟรชอัตโนมัติทุก 5 วินาที</p>
                        </div>

                        {/* Stats */}
                        <div className="flex gap-4 mt-4 md:mt-0">
                            <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-xl">
                                ⏳ รอ: <span className="font-bold">{pendingCount}</span>
                            </div>
                            <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-xl">
                                👨‍🍳 กำลังปรุง: <span className="font-bold">{cookingCount}</span>
                            </div>
                        </div>
                    </div>

                    {/* Filter */}
                    <div className="bg-white rounded-2xl shadow-sm p-4 mb-6">
                        <div className="flex flex-wrap gap-2">
                            {[
                                { value: 'active', label: 'ที่ต้องทำ' },
                                { value: 'pending', label: 'รอดำเนินการ' },
                                { value: 'cooking', label: 'กำลังปรุง' }
                            ].map(option => (
                                <button
                                    key={option.value}
                                    onClick={() => setFilter(option.value)}
                                    className={`px-4 py-2 rounded-xl font-medium transition ${filter === option.value
                                        ? 'bg-orange-500 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                {/* Orders Grid */}
                {filteredOrders.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                        <div className="text-6xl mb-4">✅</div>
                        <h2 className="text-xl font-semibold text-gray-700">ไม่มีออเดอร์</h2>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredOrders.map(order => (
                            <OrderCard
                                key={order._id}
                                order={order}
                                onUpdateStatus={handleUpdateStatus}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default KitchenPage;
