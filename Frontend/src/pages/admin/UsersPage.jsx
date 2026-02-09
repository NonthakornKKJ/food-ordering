import { useState, useEffect } from 'react';
import { userAPI } from '../../services/api';
import Navbar from '../../components/Navbar';
import Modal from '../../components/Modal';

const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        role: 'customer',
        isActive: true
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await userAPI.getAll();
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (user = null) => {
        if (user) {
            setEditingUser(user);
            setFormData({
                username: user.username,
                password: '',
                role: user.role,
                isActive: user.isActive
            });
        } else {
            setEditingUser(null);
            setFormData({
                username: '',
                password: '',
                role: 'customer',
                isActive: true
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = { ...formData };
            if (!data.password) delete data.password;

            if (editingUser) {
                await userAPI.update(editingUser._id, data);
            } else {
                await userAPI.create(data);
            }

            setIsModalOpen(false);
            fetchUsers();
        } catch (error) {
            console.error('Error saving user:', error);
            alert(error.response?.data?.message || 'เกิดข้อผิดพลาด');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('ต้องการลบผู้ใช้นี้?')) return;

        try {
            await userAPI.delete(id);
            fetchUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
            alert(error.response?.data?.message || 'เกิดข้อผิดพลาด');
        }
    };

    const roleLabels = {
        admin: { label: 'Admin', color: 'bg-purple-100 text-purple-600' },
        kitchen: { label: 'ครัว', color: 'bg-blue-100 text-blue-600' },
        customer: { label: 'ลูกค้า', color: 'bg-green-100 text-green-600' }
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
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">👥 จัดการผู้ใช้</h1>
                            <p className="text-gray-500">ทั้งหมด {users.length} คน</p>
                        </div>
                        <button
                            onClick={() => handleOpenModal()}
                            className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition"
                        >
                            + เพิ่มผู้ใช้
                        </button>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="text-left py-4 px-6 text-gray-600 font-medium">ชื่อผู้ใช้</th>
                                    <th className="text-left py-4 px-6 text-gray-600 font-medium">บทบาท</th>
                                    <th className="text-left py-4 px-6 text-gray-600 font-medium">สถานะ</th>
                                    <th className="text-left py-4 px-6 text-gray-600 font-medium">สร้างเมื่อ</th>
                                    <th className="text-left py-4 px-6 text-gray-600 font-medium">จัดการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user._id} className="border-t hover:bg-gray-50">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-lg">
                                                    👤
                                                </div>
                                                <span className="font-medium text-gray-800">{user.username}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`px-3 py-1 rounded-full text-sm ${roleLabels[user.role]?.color}`}>
                                                {roleLabels[user.role]?.label}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`px-3 py-1 rounded-full text-sm ${user.isActive
                                                ? 'bg-green-100 text-green-600'
                                                : 'bg-red-100 text-red-600'
                                                }`}>
                                                {user.isActive ? 'ใช้งาน' : 'ปิด'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-gray-500 text-sm">
                                            {new Date(user.createdAt).toLocaleDateString('th-TH')}
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleOpenModal(user)}
                                                    className="px-3 py-1.5 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
                                                >
                                                    แก้ไข
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(user._id)}
                                                    className="px-3 py-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                                                >
                                                    ลบ
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingUser ? 'แก้ไขผู้ใช้' : 'เพิ่มผู้ใช้ใหม่'}
                size="sm"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">ชื่อผู้ใช้ *</label>
                        <input
                            type="text"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-2">
                            รหัสผ่าน {editingUser ? '(เว้นว่างถ้าไม่ต้องการเปลี่ยน)' : '*'}
                        </label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                            required={!editingUser}
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-2">บทบาท *</label>
                        <select
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                        >
                            <option value="customer">ลูกค้า</option>
                            <option value="kitchen">ครัว</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="isActive"
                            checked={formData.isActive}
                            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                            className="w-5 h-5 text-orange-500 rounded focus:ring-orange-500"
                        />
                        <label htmlFor="isActive" className="text-gray-700">เปิดใช้งาน</label>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-medium hover:bg-gray-200 transition"
                        >
                            ยกเลิก
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-3 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition"
                        >
                            {editingUser ? 'บันทึก' : 'เพิ่มผู้ใช้'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default UsersPage;
