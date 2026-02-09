import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user, logout, isAdmin, isKitchen, isCustomer } = useAuth();
    const { totalItems } = useCart();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname.startsWith(path);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const closeMenu = () => setIsMenuOpen(false);

    return (
        <nav className="bg-linear-to-r from-orange-500 to-orange-600 text-white shadow-lg sticky top-0 z-50">
            <div className="flex justify-center">
                <div className="w-full max-w-6xl px-4 py-6">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link to="/menu" className="flex items-center space-x-2">
                            <span className="text-2xl">🍽️</span>
                            <span className="font-bold text-xl">Food Order</span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-4">
                            {isCustomer && (
                                <>
                                    <Link
                                        to="/menu"
                                        className={`px-3 py-2 rounded-lg transition ${isActive('/menu') ? 'bg-white/20' : 'hover:bg-white/10'
                                            }`}
                                    >
                                        เมนู
                                    </Link>
                                    <Link
                                        to="/orders"
                                        className={`px-3 py-2 rounded-lg transition ${isActive('/orders') ? 'bg-white/20' : 'hover:bg-white/10'
                                            }`}
                                    >
                                        สถานะออเดอร์
                                    </Link>
                                    <Link
                                        to="/cart"
                                        className="relative px-3 py-2 rounded-lg hover:bg-white/10 transition"
                                    >
                                        🛒
                                        {totalItems > 0 && (
                                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                                                {totalItems}
                                            </span>
                                        )}
                                    </Link>
                                </>
                            )}

                            {isKitchen && !isAdmin && (
                                <Link
                                    to="/kitchen"
                                    className={`px-3 py-2 rounded-lg transition ${isActive('/kitchen') ? 'bg-white/20' : 'hover:bg-white/10'
                                        }`}
                                >
                                    ครัว
                                </Link>
                            )}

                            {isAdmin && (
                                <>
                                    <Link
                                        to="/admin"
                                        className={`px-3 py-2 rounded-lg transition ${isActive('/admin') && !isActive('/admin/') ? 'bg-white/20' : 'hover:bg-white/10'
                                            }`}
                                    >
                                        Dashboard
                                    </Link>
                                    <Link
                                        to="/admin/menus"
                                        className={`px-3 py-2 rounded-lg transition ${isActive('/admin/menus') ? 'bg-white/20' : 'hover:bg-white/10'
                                            }`}
                                    >
                                        เมนู
                                    </Link>
                                    <Link
                                        to="/admin/categories"
                                        className={`px-3 py-2 rounded-lg transition ${isActive('/admin/categories') ? 'bg-white/20' : 'hover:bg-white/10'
                                            }`}
                                    >
                                        ประเภท
                                    </Link>
                                    <Link
                                        to="/admin/users"
                                        className={`px-3 py-2 rounded-lg transition ${isActive('/admin/users') ? 'bg-white/20' : 'hover:bg-white/10'
                                            }`}
                                    >
                                        ผู้ใช้
                                    </Link>
                                    <Link
                                        to="/admin/tables"
                                        className={`px-3 py-2 rounded-lg transition ${isActive('/admin/tables') ? 'bg-white/20' : 'hover:bg-white/10'
                                            }`}
                                    >
                                        โต๊ะ & QR
                                    </Link>
                                    <Link
                                        to="/kitchen"
                                        className={`px-3 py-2 rounded-lg transition ${isActive('/kitchen') ? 'bg-white/20' : 'hover:bg-white/10'
                                            }`}
                                    >
                                        ครัว
                                    </Link>
                                </>
                            )}

                            {/* User info & Logout */}
                            <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-white/30">
                                <span className="text-sm">
                                    {user?.username || `โต๊ะ ${user?.tableNumber}`}
                                </span>
                                {!isCustomer && (
                                    <button
                                        onClick={handleLogout}
                                        className="bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg text-sm transition"
                                    >
                                        ออกจากระบบ
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Mobile Menu Button & Cart */}
                        <div className="md:hidden flex items-center space-x-3">
                            {/* Cart Icon for Customer (Mobile) */}
                            {isCustomer && (
                                <Link
                                    to="/cart"
                                    className="relative px-2 py-1 rounded-lg hover:bg-white/10 transition"
                                >
                                    🛒
                                    {totalItems > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                                            {totalItems}
                                        </span>
                                    )}
                                </Link>
                            )}

                            {/* Hamburger Menu Button */}
                            <button
                                onClick={toggleMenu}
                                className="p-2 rounded-lg hover:bg-white/10 transition"
                                aria-label="Toggle menu"
                            >
                                {isMenuOpen ? (
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                ) : (
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu Dropdown */}
                    {isMenuOpen && (
                        <div className="md:hidden py-4 border-t border-white/20 animate-fade-in">
                            <div className="flex flex-col space-y-2">
                                {isCustomer && (
                                    <>
                                        <Link
                                            to="/menu"
                                            onClick={closeMenu}
                                            className={`px-4 py-3 rounded-xl transition ${isActive('/menu') ? 'bg-white/20' : 'hover:bg-white/10'
                                                }`}
                                        >
                                            🍽️ เมนู
                                        </Link>
                                        <Link
                                            to="/orders"
                                            onClick={closeMenu}
                                            className={`px-4 py-3 rounded-xl transition ${isActive('/orders') ? 'bg-white/20' : 'hover:bg-white/10'
                                                }`}
                                        >
                                            📋 สถานะออเดอร์
                                        </Link>
                                        <Link
                                            to="/cart"
                                            onClick={closeMenu}
                                            className={`px-4 py-3 rounded-xl transition flex items-center justify-between ${isActive('/cart') ? 'bg-white/20' : 'hover:bg-white/10'
                                                }`}
                                        >
                                            <span>🛒 ตะกร้า</span>
                                            {totalItems > 0 && (
                                                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                                                    {totalItems} รายการ
                                                </span>
                                            )}
                                        </Link>
                                    </>
                                )}

                                {isKitchen && !isAdmin && (
                                    <Link
                                        to="/kitchen"
                                        onClick={closeMenu}
                                        className={`px-4 py-3 rounded-xl transition ${isActive('/kitchen') ? 'bg-white/20' : 'hover:bg-white/10'
                                            }`}
                                    >
                                        👨‍🍳 ครัว
                                    </Link>
                                )}

                                {isAdmin && (
                                    <>
                                        <Link
                                            to="/admin"
                                            onClick={closeMenu}
                                            className={`px-4 py-3 rounded-xl transition ${isActive('/admin') && !isActive('/admin/') ? 'bg-white/20' : 'hover:bg-white/10'
                                                }`}
                                        >
                                            📊 Dashboard
                                        </Link>
                                        <Link
                                            to="/admin/menus"
                                            onClick={closeMenu}
                                            className={`px-4 py-3 rounded-xl transition ${isActive('/admin/menus') ? 'bg-white/20' : 'hover:bg-white/10'
                                                }`}
                                        >
                                            🍽️ จัดการเมนู
                                        </Link>
                                        <Link
                                            to="/admin/categories"
                                            onClick={closeMenu}
                                            className={`px-4 py-3 rounded-xl transition ${isActive('/admin/categories') ? 'bg-white/20' : 'hover:bg-white/10'
                                                }`}
                                        >
                                            📁 จัดการประเภท
                                        </Link>
                                        <Link
                                            to="/admin/users"
                                            onClick={closeMenu}
                                            className={`px-4 py-3 rounded-xl transition ${isActive('/admin/users') ? 'bg-white/20' : 'hover:bg-white/10'
                                                }`}
                                        >
                                            👥 จัดการผู้ใช้
                                        </Link>
                                        <Link
                                            to="/kitchen"
                                            onClick={closeMenu}
                                            className={`px-4 py-3 rounded-xl transition ${isActive('/kitchen') ? 'bg-white/20' : 'hover:bg-white/10'
                                                }`}
                                        >
                                            👨‍🍳 ครัว
                                        </Link>
                                    </>
                                )}

                                {/* User Info & Logout */}
                                <div className="mt-4 pt-4 border-t border-white/20">
                                    <div className="px-4 py-2 text-white/80 text-sm">
                                        👤 {user?.username || `โต๊ะ ${user?.tableNumber}`}
                                    </div>
                                    {!isCustomer && (
                                        <button
                                            onClick={() => {
                                                closeMenu();
                                                handleLogout();
                                            }}
                                            className="w-full text-left px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition mt-2"
                                        >
                                            🚪 ออกจากระบบ
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
