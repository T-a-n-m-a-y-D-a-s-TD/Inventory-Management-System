import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Pages
import Dashboard from './pages/Dashboard';
import ProductsPage from './pages/ProductsPage';
import SuppliersPage from './pages/SuppliersPage';
import ReportsPage from './pages/ReportsPage';
import UsersPage from './pages/UsersPage';
import SettingsPage from './pages/SettingsPage';
import LoginPage from './pages/LoginPage';
import SalesPage from './pages/SalesPage';

// Components
import Layout from './components/Layout';

// Context
import { AuthProvider } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';
import { SupplierProvider } from './context/SupplierContext';
import { UserProvider } from './context/UserContext';
import { SalesProvider } from './context/SalesContext';

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <UserProvider>
          <SupplierProvider>
            <ProductProvider>
              <SalesProvider>
                <Toaster position="top-right" />
                <Routes>
                  <Route path="/login" element={<LoginPage />} />
                  <Route 
                    path="/" 
                    element={
                      <ProtectedRoute>
                        <Layout />
                      </ProtectedRoute>
                    }
                  >
                    <Route index element={<Dashboard />} />
                    <Route path="products" element={<ProductsPage />} />
                    <Route path="sales" element={<SalesPage />} />
                    <Route path="suppliers" element={<SuppliersPage />} />
                    <Route path="reports" element={<ReportsPage />} />
                    <Route path="users" element={<UsersPage />} />
                    <Route path="settings" element={<SettingsPage />} />
                  </Route>
                  <Route path="*" element={<Navigate to="/\" replace />} />
                </Routes>
              </SalesProvider>
            </ProductProvider>
          </SupplierProvider>
        </UserProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;