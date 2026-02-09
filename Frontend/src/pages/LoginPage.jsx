import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login, qrLogin } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const checkQRLogin = async () => {
            const params = new URLSearchParams(window.location.search);
            const qrCode = params.get('qr');

            if (qrCode) {
                setLoading(true);
                try {
                    await qrLogin(qrCode);
                    navigate('/menu');
                } catch (err) {
                    setError('QR Code ไม่ถูกต้อง หรือมีปัญหาในการเข้าสู่ระบบ');
                    setLoading(false);
                }
            }
        };

        checkQRLogin();
    }, [navigate, qrLogin]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            let userData;

            userData = await login(username, password);

            // Redirect based on role
            if (userData.role === 'admin') {
                navigate('/admin');
            } else if (userData.role === 'kitchen') {
                navigate('/kitchen');
            } else {
                navigate('/menu');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen items-center justify-center p-10">
            <div className="w-full max-w-4xl rounded-2xl border border-blue-800 md:shadow-xl bg-white">
                <div className="grid md:grid-cols-2 p-5">
                    <div className="hidden md:flex items-center justify-center">
                        <img
                            src="https://cdni.iconscout.com/illustration/premium/thumb/login-10299071-8333958.png?f=webp"
                            alt="Login Illustration"
                            className="max-w-full h-auto"
                        />
                    </div>
                    <div className="flex flex-col items-center justify-center p-5">
                        <form onSubmit={handleSubmit} className="w-full max-w-sm">
                            <h1 className="text-center font-extrabold uppercase text-rose-500 text-3xl mb-8">User Login</h1>

                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-2xl mb-4 text-center">
                                    {error}
                                </div>
                            )}

                            <input
                                type="text"
                                className="mb-4 w-full rounded-2xl bg-zinc-100 outline-rose-400 px-5 py-3"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                            <input
                                type="password"
                                className="mb-6 w-full rounded-2xl bg-zinc-100 outline-rose-400 px-5 py-3"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full rounded-2xl bg-rose-500 px-5 py-3 font-semibold text-white hover:bg-rose-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Logging in...' : 'Login'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
