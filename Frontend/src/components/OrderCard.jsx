const OrderCard = ({ order, onUpdateStatus, showActions = true }) => {
    const statusConfig = {
        pending: {
            label: 'รอดำเนินการ',
            color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
            icon: '⏳'
        },
        cooking: {
            label: 'กำลังปรุง',
            color: 'bg-orange-100 text-orange-800 border-orange-300',
            icon: '👨‍🍳'
        },
        completed: {
            label: 'เสร็จสิ้น',
            color: 'bg-green-100 text-green-800 border-green-300',
            icon: '✅'
        }
    };

    const status = statusConfig[order.status] || statusConfig.pending;

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('th-TH', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
            {/* Header */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-3 flex justify-between items-center">
                <div className="flex items-center space-x-3">
                    <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        โต๊ะ {order.tableNumber}
                    </span>
                    <span className="text-gray-500 text-sm">
                        {formatTime(order.createdAt)}
                    </span>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium border ${status.color}`}>
                    {status.icon} {status.label}
                </div>
            </div>

            {/* Items */}
            <div className="p-4">
                <div className="space-y-2 mb-4">
                    {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                                <span className="bg-orange-100 text-orange-600 px-2 py-0.5 rounded text-sm font-medium">
                                    x{item.quantity}
                                </span>
                                <span className="text-gray-700">{item.name}</span>
                            </div>
                            <span className="text-gray-500 text-sm">
                                ฿{item.price * item.quantity}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Total */}
                <div className="border-t pt-3 flex justify-between items-center">
                    <span className="font-medium text-gray-700">รวม</span>
                    <span className="text-xl font-bold text-orange-600">
                        ฿{order.totalPrice}
                    </span>
                </div>

                {/* Actions */}
                {showActions && order.status !== 'completed' && (
                    <div className="mt-4 flex space-x-2">
                        {order.status === 'pending' && (
                            <button
                                onClick={() => onUpdateStatus(order._id, 'cooking')}
                                className="flex-1 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition"
                            >
                                👨‍🍳 เริ่มปรุง
                            </button>
                        )}
                        {order.status === 'cooking' && (
                            <button
                                onClick={() => onUpdateStatus(order._id, 'completed')}
                                className="flex-1 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium transition"
                            >
                                ✅ เสร็จสิ้น
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderCard;
