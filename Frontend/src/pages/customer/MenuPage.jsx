import { useState, useEffect } from 'react';
import { menuAPI, categoryAPI } from '../../services/api';
import { useCart } from '../../context/CartContext';
import MenuCard from '../../components/MenuCard';
import Navbar from '../../components/Navbar';

const MenuPage = () => {
    const [menus, setMenus] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const { addItem } = useCart();

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

    const filteredMenus = menus.filter(menu => {
        const matchesCategory = selectedCategory === 'all' || menu.category?._id === selectedCategory;
        const matchesSearch = menu.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const handleAddToCart = (menu) => {
        addItem(menu);
        // Show toast notification (simple alert for now)
        const toast = document.createElement('div');
        toast.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg z-50 animate-bounce';
        toast.textContent = `✓ เพิ่ม ${menu.name} แล้ว`;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2000);
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
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">🍽️ เมนูอาหาร</h1>
                        <p className="text-gray-500">เลือกเมนูที่ต้องการสั่ง</p>
                    </div>

                    {/* Search & Filter */}
                    <div className="bg-white rounded-2xl shadow-sm p-4 mb-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            {/* Search */}
                            <div className="flex-1">
                                <input
                                    type="text"
                                    placeholder="🔍 ค้นหาเมนู..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>

                            {/* Category Filter */}
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => setSelectedCategory('all')}
                                    className={`px-4 py-2 rounded-xl font-medium transition ${selectedCategory === 'all'
                                        ? 'bg-orange-500 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    ทั้งหมด
                                </button>
                                {categories.map(category => (
                                    <button
                                        key={category._id}
                                        onClick={() => setSelectedCategory(category._id)}
                                        className={`px-4 py-2 rounded-xl font-medium transition ${selectedCategory === category._id
                                            ? 'bg-orange-500 text-white'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                    >
                                        {category.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Menu Grid */}
                    {filteredMenus.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">🍴</div>
                            <p className="text-gray-500">ไม่พบเมนูที่ค้นหา</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredMenus.map(menu => (
                                <MenuCard
                                    key={menu._id}
                                    menu={menu}
                                    onAddToCart={handleAddToCart}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MenuPage;
