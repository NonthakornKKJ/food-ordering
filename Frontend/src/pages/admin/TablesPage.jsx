import { useState, useEffect } from 'react';
// import { QRCodeCanvas } from 'qrcode.react';
import { tableAPI } from '../../services/api';
import Navbar from '../../components/Navbar';

const TablesPage = () => {
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [baseUrl, setBaseUrl] = useState('');

    useEffect(() => {
        fetchTables();
        setBaseUrl(window.location.origin);
    }, []);

    const fetchTables = async () => {
        try {
            const response = await tableAPI.getAll();
            setTables(response.data);
        } catch (error) {
            console.error('Error fetching tables:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="container-wide py-8">
                <div className="flex justify-between items-center mb-8 no-print">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">QR Codes โต๊ะอาหาร</h1>
                        <p className="text-gray-500">พิมพ์ QR Code เพื่อติดที่โต๊ะอาหาร</p>
                    </div>
                    <button
                        onClick={handlePrint}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-xl flex items-center gap-2 font-medium transition"
                    >
                        🖨️ พิมพ์ QR Codes
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 print:grid-cols-2 print:gap-8">
                    {tables.map(table => (
                        <div key={table._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center print:border-2 print:border-gray-300 print:shadow-none">
                            <h3 className="text-2xl font-bold text-gray-800 mb-4">โต๊ะ {table.tableNumber}</h3>

                            <div className="bg-white p-2 rounded-xl border border-gray-100 mb-4">
                                {/* <QRCodeCanvas
                                    value={`${baseUrl}/login?qr=${table.qrCode}`}
                                    size={200}
                                    level={"H"}
                                /> */}
                                <div className="h-48 w-48 bg-gray-200 flex items-center justify-center rounded-lg flex-col gap-2">
                                    <span className="text-gray-500 font-bold">QR Code</span>
                                    <a
                                        href={`${baseUrl}/login?qr=${table.qrCode}`}
                                        className="text-xs text-blue-500 hover:underline"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        [Test Link]
                                    </a>
                                </div>
                            </div>
                            <p className="text-xs text-gray-400 mb-2 truncate max-w-full" title={`${baseUrl}/login?qr=${table.qrCode}`}>
                                {baseUrl}/login?qr={table.qrCode}
                            </p>
                            {baseUrl.includes('localhost') && (
                                <p className="text-xs text-red-500 mb-2 print:hidden">
                                    Warning: 'localhost' won't work on mobile. Use IP.
                                </p>
                            )}

                            <p className="text-sm text-gray-400 font-mono bg-gray-50 px-3 py-1 rounded-lg print:hidden">
                                {table.qrCode}
                            </p>
                            <p className="text-xs text-gray-400 mt-2 print:hidden">
                                สแกนเพื่อสั่งอาหาร
                            </p>

                            {/* Print-only footer */}
                            <div className="hidden print:block mt-2">
                                <p className="text-lg font-medium text-gray-600">สแกนเพื่อสั่งอาหาร</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style>
                {`
                    @media print {
                        .no-print {
                            display: none;
                        }
                        nav {
                            display: none;
                        }
                        body {
                            background: white;
                        }
                        .container-wide {
                            padding: 0;
                            max-width: none;
                        }
                    }
                `}
            </style>
        </div>
    );
};

export default TablesPage;
