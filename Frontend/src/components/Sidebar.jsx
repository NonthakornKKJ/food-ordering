import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const { user } = useAuth();

    return (
        <aside className="w-64 bg-white border-r hidden md:flex flex-col min-h-screen">
            <div className="px-6 py-6 border-b">
                <div className="flex items-center gap-3">
                    <span className="text-2xl">🍽️</span>
                    <div>
                        <div className="font-bold">Food Order</div>
                        <div className="text-sm text-gray-500">{user?.username || `โต๊ะ ${user?.tableNumber}`}</div>
                    </div>
                </div>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-2">
                <Link to="/admin" className="block px-3 py-2 rounded-lg hover:bg-gray-100">📊 Dashboard</Link>
                <Link to="/admin/menus" className="block px-3 py-2 rounded-lg hover:bg-gray-100">🍽️ เมนู</Link>
                <Link to="/admin/categories" className="block px-3 py-2 rounded-lg hover:bg-gray-100">📁 ประเภท</Link>
                <Link to="/admin/users" className="block px-3 py-2 rounded-lg hover:bg-gray-100">👥 ผู้ใช้</Link>
                <Link to="/admin/tables" className="block px-3 py-2 rounded-lg hover:bg-gray-100">🪑 โต๊ะ & QR</Link>
                <Link to="/kitchen" className="block px-3 py-2 rounded-lg hover:bg-gray-100">👨‍🍳 ครัว</Link>
            </nav>

            <div className="px-4 py-6 border-t text-sm text-gray-600">© {new Date().getFullYear()}</div>
        </aside>
    );
};

export default Sidebar;
