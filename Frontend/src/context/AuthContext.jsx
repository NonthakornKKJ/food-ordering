import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const run = async () => {
            try {
                const params = new URLSearchParams(window.location.search);
                const qr = params.get('qr');
                const token = localStorage.getItem('token');
                const savedUser = localStorage.getItem('user');

                if (qr) {
                    // If QR code provided in URL, perform QR login and clean URL
                    try {
                        await qrLogin(qr);
                        params.delete('qr');
                        const newUrl = window.location.pathname + (params.toString() ? `?${params.toString()}` : '');
                        window.history.replaceState({}, '', newUrl);
                    } catch (e) {
                        console.error('QR login failed', e);
                    }
                } else if (token && savedUser) {
                    setUser(JSON.parse(savedUser));
                } else if (token && !savedUser) {
                    // If a token exists but no saved user, try to fetch current user
                    try {
                        const response = await authAPI.getMe();
                        const current = response.data.user;
                        localStorage.setItem('user', JSON.stringify(current));
                        setUser(current);
                    } catch (e) {
                        // invalid token - clear
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        setUser(null);
                    }
                }
            } finally {
                setLoading(false);
            }
        };

        run();
    }, []);

    const login = async (username, password) => {
        const response = await authAPI.login({ username, password });
        const { token, user: userData } = response.data;

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);

        return userData;
    };

    const qrLogin = async (qrCode) => {
        const response = await authAPI.qrLogin({ qrCode });
        const { token, tableNumber, role } = response.data;

        const userData = { tableNumber, role };
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);

        return userData;
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    const value = {
        user,
        loading,
        login,
        qrLogin,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isKitchen: user?.role === 'kitchen' || user?.role === 'admin',
        isCustomer: user?.role === 'customer',
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
