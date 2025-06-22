import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Truck, 
  FileBarChart, 
  Users, 
  Settings, 
  Menu, 
  X, 
  Bell, 
  User, 
  LogOut,
  ChevronDown,
  ShoppingCart
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductContext';

const BottomNav = () => {
  const location = useLocation();
  const { currentUser } = useAuth();
  const role = currentUser?.role || 'staff';

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} />, roles: ['admin', 'manager', 'staff'] },
    { name: 'Products', path: '/products', icon: <Package size={20} />, roles: ['admin', 'manager', 'staff'] },
    { name: 'Sales', path: '/sales', icon: <ShoppingCart size={20} />, roles: ['admin', 'manager', 'staff'] },
    { name: 'Suppliers', path: '/suppliers', icon: <Truck size={20} />, roles: ['admin', 'manager'] },
    { name: 'Reports', path: '/reports', icon: <FileBarChart size={20} />, roles: ['admin', 'manager'] },
    { name: 'Users', path: '/users', icon: <Users size={20} />, roles: ['admin'] },
    { name: 'Settings', path: '/settings', icon: <Settings size={20} />, roles: ['admin'] }
  ];

  const filteredNavItems = navItems.filter(item => item.roles.includes(role));

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[var(--neutral-200)] z-50">
      <div className="flex justify-around items-center h-16 px-4">
        {filteredNavItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center justify-center px-3 py-2 rounded-md transition-all ${
              location.pathname === item.path
                ? 'text-[var(--primary-700)]'
                : 'text-[var(--neutral-600)] hover:text-[var(--primary-600)]'
            }`}
          >
            {item.icon}
            <span className="text-xs mt-1">{item.name}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

const Header = () => {
  const { getLowStockProducts } = useProducts();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { currentUser } = useAuth();
  
  const lowStockProducts = getLowStockProducts();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[var(--neutral-200)]">
      <div className="flex items-center justify-between h-16 px-4">
        <div className="flex items-center">
          <div className="bg-[var(--primary-500)] text-white font-bold text-xl h-10 w-10 rounded-md flex items-center justify-center">
            GT
          </div>
          <h1 className="ml-3 text-xl font-semibold text-[var(--neutral-800)]">
            Glitched Technologies
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <button
              className="p-2 text-[var(--neutral-600)] hover:text-[var(--neutral-800)] hover:bg-[var(--neutral-100)] rounded-full"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell size={20} />
              {lowStockProducts.length > 0 && (
                <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-[var(--error-500)] text-white text-xs flex items-center justify-center">
                  {lowStockProducts.length}
                </span>
              )}
            </button>
            
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg border border-[var(--neutral-200)] py-1 z-50 animate-fade-in">
                <div className="px-4 py-2 border-b border-[var(--neutral-200)]">
                  <h3 className="text-sm font-medium text-[var(--neutral-800)]">Notifications</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {lowStockProducts.length > 0 ? (
                    lowStockProducts.map((product) => (
                      <div key={product.id} className="px-4 py-2 hover:bg-[var(--neutral-50)]">
                        <div className="text-sm text-[var(--error-600)]">
                          Low stock alert: {product.name}
                        </div>
                        <div className="text-xs text-[var(--neutral-500)]">
                          Current quantity: {product.quantity} (below threshold of {product.threshold})
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-sm text-[var(--neutral-600)]">
                      No low stock alerts
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <div className="relative">
            <button
              className="flex items-center text-[var(--neutral-600)] hover:text-[var(--neutral-800)]"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <div className="h-8 w-8 rounded-full bg-[var(--primary-100)] flex items-center justify-center text-[var(--primary-700)] font-semibold">
                {currentUser?.name?.charAt(0) || 'U'}
              </div>
              <ChevronDown size={16} className="ml-1" />
            </button>
            
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-[var(--neutral-200)] py-1 z-50 animate-fade-in">
                <div className="px-4 py-2 border-b border-[var(--neutral-200)]">
                  <p className="text-sm font-medium text-[var(--neutral-800)]">{currentUser?.name}</p>
                  <p className="text-xs text-[var(--neutral-500)]">{currentUser?.email}</p>
                </div>
                <Link to="/settings" className="flex items-center px-4 py-2 text-sm text-[var(--neutral-700)] hover:bg-[var(--neutral-50)]">
                  <User size={16} className="mr-2" />
                  Profile
                </Link>
                <button
                  className="flex w-full items-center px-4 py-2 text-sm text-[var(--error-600)] hover:bg-[var(--neutral-50)]"
                  onClick={handleLogout}
                >
                  <LogOut size={16} className="mr-2" />
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

const Layout = () => {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header />
      
      <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-[var(--neutral-100)] pb-20">
        <Outlet />
      </main>
      
      <BottomNav />
    </div>
  );
};

export default Layout;