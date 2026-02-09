import { useState, useEffect } from 'react';
import { menuAPI, categoryAPI } from '../../services/api';
import Navbar from '../../components/Navbar';
import Modal from '../../components/Modal';

const MenusPage = () => {
    const [menus, setMenus] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMenu, setEditingMenu] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        image: '',
        isAvailable: true
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [menuRes, categoryRes] = await Promise.all([
                menuAPI.getAll(),
                categoryAPI.getAll()
            ]);
            setMenus(menuRes.data);
            setCategories(categoryRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (menu = null) => {
        if (menu) {
            setEditingMenu(menu);
            setFormData({
                name: menu.name,
                description: menu.description || '',
                price: menu.price.toString(),
                category: menu.category?._id || '',
                image: menu.image || '',
                isAvailable: menu.isAvailable
            });
        } else {
            setEditingMenu(null);
            setFormData({
                name: '',
                description: '',
                price: '',
                category: categories[0]?._id || '',
                image: '',
                isAvailable: true
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = {
                ...formData,
                price: parseFloat(formData.price)
            };

            if (editingMenu) {
                await menuAPI.update(editingMenu._id, data);
            } else {
                await menuAPI.create(data);
            }

            setIsModalOpen(false);
            fetchData();
        } catch (error) {
            console.error('Error saving menu:', error);
            alert(error.response?.data?.message || 'เกิดข้อผิดพลาด');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('ต้องการลบเมนูนี้?')) return;

        try {
            await menuAPI.delete(id);
            fetchData();
        } catch (error) {
            console.error('Error deleting menu:', error);
            alert(error.response?.data?.message || 'เกิดข้อผิดพลาด');
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
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1 md:mb-2">🍽️ จัดการเมนู</h1>
                            <p className="text-sm md:text-base text-gray-500">ทั้งหมด {menus.length} เมนู</p>
                        </div>
                        <button
                            onClick={() => handleOpenModal()}
                            className="w-full md:w-auto px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition"
                        >
                            + เพิ่มเมนู
                        </button>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-4">
                        {menus.map(menu => (
                            <div key={menu._id} className="bg-white rounded-2xl shadow-sm p-4">
                                <div className="flex items-start gap-3 mb-3">
                                    <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center text-3xl flex-shrink-0">
                                        {menu.image ? (
                                            <img src={menu.image} alt={menu.name} className="w-full h-full object-cover rounded-xl" />
                                        ) : (
                                            '🍴'
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-gray-800 text-lg">{menu.name}</p>
                                        <p className="text-sm text-gray-500 truncate">{menu.description || '-'}</p>
                                        <p className="text-sm text-gray-400 mt-1">{menu.category?.name || 'ไม่ระบุประเภท'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="font-bold text-orange-600 text-lg">฿{menu.price}</span>
                                        <span className={`px-2 py-1 rounded-full text-xs ${menu.isAvailable
                                            ? 'bg-green-100 text-green-600'
                                            : 'bg-red-100 text-red-600'
                                            }`}>
                                            {menu.isAvailable ? 'พร้อมขาย' : 'หมด'}
                                        </span>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleOpenModal(menu)}
                                            className="px-3 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition text-sm"
                                        >
                                            แก้ไข
                                        </button>
                                        <button
                                            onClick={() => handleDelete(menu._id)}
                                            className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition text-sm"
                                        >
                                            ลบ
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Desktop Table View */}
                    <div className="hidden md:block bg-white rounded-2xl shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="text-left py-4 px-6 text-gray-600 font-medium">เมนู</th>
                                        <th className="text-left py-4 px-6 text-gray-600 font-medium">ประเภท</th>
                                        <th className="text-left py-4 px-6 text-gray-600 font-medium">ราคา</th>
                                        <th className="text-left py-4 px-6 text-gray-600 font-medium">สถานะ</th>
                                        <th className="text-left py-4 px-6 text-gray-600 font-medium">จัดการ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {menus.map(menu => (
                                        <tr key={menu._id} className="border-t hover:bg-gray-50">
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-2xl">
                                                        {menu.image ? (
                                                            <img src={menu.image} alt={menu.name} className="w-full h-full object-cover rounded-xl" />
                                                        ) : (
                                                            '🍴'
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-800">{menu.name}</p>
                                                        <p className="text-sm text-gray-500 truncate max-w-xs">{menu.description}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-gray-600">{menu.category?.name || '-'}</td>
                                            <td className="py-4 px-6 font-medium text-orange-600">฿{menu.price}</td>
                                            <td className="py-4 px-6">
                                                <span className={`px-3 py-1 rounded-full text-sm ${menu.isAvailable
                                                    ? 'bg-green-100 text-green-600'
                                                    : 'bg-red-100 text-red-600'
                                                    }`}>
                                                    {menu.isAvailable ? 'พร้อมขาย' : 'หมด'}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleOpenModal(menu)}
                                                        className="px-3 py-1.5 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
                                                    >
                                                        แก้ไข
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(menu._id)}
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
            </div>

            {/* Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingMenu ? 'แก้ไขเมนู' : 'เพิ่มเมนูใหม่'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">ชื่อเมนู *</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-2">รายละเอียด</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                            rows={3}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">ราคา (บาท) *</label>
                            <input
                                type="number"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                                min="0"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-2">ประเภท *</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                                required
                            >
                                <option value="">เลือกประเภท</option>
                                {categories.map(cat => (
                                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-2">URL รูปภาพ</label>
                        <input
                            type="url"
                            value={formData.image}
                            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder="https://example.com/image.jpg"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="isAvailable"
                            checked={formData.isAvailable}
                            onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                            className="w-5 h-5 text-orange-500 rounded focus:ring-orange-500"
                        />
                        <label htmlFor="isAvailable" className="text-gray-700">พร้อมขาย</label>
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
                            {editingMenu ? 'บันทึก' : 'เพิ่มเมนู'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default MenusPage;
