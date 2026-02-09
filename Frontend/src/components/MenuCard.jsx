const MenuCard = ({ menu, onAddToCart }) => {
    return (
        <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
            {/* Image */}
            <div className="relative h-48 bg-gradient-to-br from-orange-100 to-orange-50 overflow-hidden">
                {menu.image ? (
                    <img
                        src={menu.image}
                        alt={menu.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl">
                        🍴
                    </div>
                )}
                {!menu.isAvailable && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="bg-red-500 text-white px-4 py-2 rounded-full font-medium">
                            หมดแล้ว
                        </span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg text-gray-800 line-clamp-1">
                        {menu.name}
                    </h3>
                    <span className="text-orange-600 font-bold text-lg">
                        ฿{menu.price}
                    </span>
                </div>

                <p className="text-gray-500 text-sm line-clamp-2 mb-4 min-h-[40px]">
                    {menu.description || 'ไม่มีรายละเอียด'}
                </p>

                <button
                    onClick={() => onAddToCart(menu)}
                    disabled={!menu.isAvailable}
                    className={`w-full py-2.5 rounded-xl font-medium transition-all duration-200 ${menu.isAvailable
                            ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 hover:shadow-lg'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                >
                    {menu.isAvailable ? '+ เพิ่มลงตะกร้า' : 'สินค้าหมด'}
                </button>
            </div>
        </div>
    );
};

export default MenuCard;
