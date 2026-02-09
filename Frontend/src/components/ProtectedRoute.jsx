import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { user, loading, isAuthenticated } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
        // Redirect based on role
        if (user?.role === 'admin') {
            return <Navigate to="/admin" replace />;
        } else if (user?.role === 'kitchen') {
            return <Navigate to="/kitchen" replace />;
        } else {
            return <Navigate to="/menu" replace />;
        }
    }

    return children;
};

export default ProtectedRoute;
