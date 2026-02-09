import { useState, useEffect } from 'react';
import { dashboardAPI } from '../../services/api';
import Navbar from '../../components/Navbar';

const DashboardPage = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await dashboardAPI.getStats();
            setStats(response.data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

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

            <div className="flex justify-center">
                <div className="w-full max-w-6xl px-4 py-6">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">📊 Dashboard</h1>
                        <p className="text-gray-500">ภาพรวมระบบ</p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-2xl p-6 shadow-lg">
                            <div className="text-4xl mb-2">📦</div>
                            <div className="text-3xl font-bold">{stats?.orders?.total || 0}</div>
                            <div className="text-orange-100">ออเดอร์ทั้งหมด</div>
                        </div>

                        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl p-6 shadow-lg">
                            <div className="text-4xl mb-2">💰</div>
                            <div className="text-3xl font-bold">฿{stats?.orders?.todayRevenue || 0}</div>
                            <div className="text-green-100">รายได้วันนี้</div>
                        </div>

                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-6 shadow-lg">
                            <div className="text-4xl mb-2">🍽️</div>
                            <div className="text-3xl font-bold">{stats?.menus?.total || 0}</div>
                            <div className="text-blue-100">เมนูทั้งหมด</div>
                        </div>

                        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl p-6 shadow-lg">
                            <div className="text-4xl mb-2">👥</div>
                            <div className="text-3xl font-bold">{stats?.users?.total || 0}</div>
                            <div className="text-purple-100">ผู้ใช้งาน</div>
                        </div>
                    </div>

                    {/* Order Status */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        <div className="bg-white rounded-2xl shadow-sm p-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">📋 สถานะออเดอร์</h2>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="flex items-center">
                                        <span className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></span>
                                        รอดำเนินการ
                                    </span>
                                    <span className="font-bold text-yellow-600">{stats?.orders?.pending || 0}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="flex items-center">
                                        <span className="w-3 h-3 bg-blue-400 rounded-full mr-2"></span>
                                        กำลังปรุง
                                    </span>
                                    <span className="font-bold text-blue-600">{stats?.orders?.cooking || 0}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="flex items-center">
                                        <span className="w-3 h-3 bg-green-400 rounded-full mr-2"></span>
                                        เสร็จสิ้น
                                    </span>
                                    <span className="font-bold text-green-600">{stats?.orders?.completed || 0}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm p-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">🔥 เมนูยอดนิยม</h2>
                            <div className="space-y-3">
                                {stats?.popularItems?.length > 0 ? (
                                    stats.popularItems.map((item, index) => (
                                        <div key={index} className="flex items-center justify-between">
                                            <span className="flex items-center">
                                                <span className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-medium mr-2">
                                                    {index + 1}
                                                </span>
                                                {item.name}
                                            </span>
                                            <span className="text-gray-500">{item.count} ชิ้น</span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-400 text-center py-4">ยังไม่มีข้อมูล</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Recent Orders */}
                    <div className="bg-white rounded-2xl shadow-sm p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">🕐 ออเดอร์ล่าสุด</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left py-3 px-4 text-gray-600">โต๊ะ</th>
                                        <th className="text-left py-3 px-4 text-gray-600">รายการ</th>
                                        <th className="text-left py-3 px-4 text-gray-600">ราคา</th>
                                        <th className="text-left py-3 px-4 text-gray-600">สถานะ</th>
                                        <th className="text-left py-3 px-4 text-gray-600">เวลา</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats?.recentOrders?.length > 0 ? (
                                        stats.recentOrders.slice(0, 5).map(order => (
                                            <tr key={order._id} className="border-b hover:bg-gray-50">
                                                <td className="py-3 px-4">
                                                    <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded-full text-sm font-medium">
                                                        {order.tableNumber}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 text-gray-700">
                                                    {order.items.map(i => i.name).join(', ')}
                                                </td>
                                                <td className="py-3 px-4 font-medium">฿{order.totalPrice}</td>
                                                <td className="py-3 px-4">
                                                    <span className={`px-2 py-1 rounded-full text-sm ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                                                        order.status === 'cooking' ? 'bg-blue-100 text-blue-600' :
                                                            'bg-green-100 text-green-600'
                                                        }`}>
                                                        {order.status === 'pending' ? 'รอ' :
                                                            order.status === 'cooking' ? 'ปรุง' : 'เสร็จ'}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 text-gray-500 text-sm">
                                                    {new Date(order.createdAt).toLocaleTimeString('th-TH', {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="text-center py-8 text-gray-400">
                                                ยังไม่มีออเดอร์
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
