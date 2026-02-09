import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
// Lazy load to prevent bundle crashes affecting other pages
const TablesPage = lazy(() => import('./pages/admin/TablesPage'));
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LoginPage from './pages/LoginPage';
import MenuPage from './pages/customer/MenuPage';
import CartPage from './pages/customer/CartPage';
import OrderStatusPage from './pages/customer/OrderStatusPage';
import KitchenPage from './pages/KitchenPage';
import DashboardPage from './pages/admin/DashboardPage';
import MenusPage from './pages/admin/MenusPage';
import CategoriesPage from './pages/admin/CategoriesPage';
import UsersPage from './pages/admin/UsersPage';


function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            {/* Public */}
            <Route path="/login" element={<LoginPage />} />

            {/* Customer Routes */}
            <Route path="/menu" element={
              <ProtectedRoute allowedRoles={['customer']}>
                <MenuPage />
              </ProtectedRoute>
            } />
            <Route path="/cart" element={
              <ProtectedRoute allowedRoles={['customer']}>
                <CartPage />
              </ProtectedRoute>
            } />
            <Route path="/orders" element={
              <ProtectedRoute allowedRoles={['customer']}>
                <OrderStatusPage />
              </ProtectedRoute>
            } />

            {/* Kitchen Routes */}
            <Route path="/kitchen" element={
              <ProtectedRoute allowedRoles={['kitchen', 'admin']}>
                <KitchenPage />
              </ProtectedRoute>
            } />

            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <DashboardPage />
              </ProtectedRoute>
            } />
            <Route path="/admin/menus" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <MenusPage />
              </ProtectedRoute>
            } />
            <Route path="/admin/categories" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <CategoriesPage />
              </ProtectedRoute>
            } />
            <Route path="/admin/users" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <UsersPage />
              </ProtectedRoute>
            } />
            <Route path="/admin/tables" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Suspense fallback={<div>Loading...</div>}>
                  <TablesPage />
                </Suspense>
              </ProtectedRoute>
            } />

            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
