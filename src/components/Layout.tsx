import React from 'react';
import { motion } from 'framer-motion';
import { Monitor, User, LogOut, Settings, Users, Smartphone } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isAdmin = user?.role === 'admin';
  const currentPath = location.pathname;

  const adminNavItems = [
    { path: '/admin', label: 'Dashboard', icon: Monitor },
    { path: '/admin/users', label: 'Users', icon: Users },
    { path: '/admin/devices', label: 'Devices', icon: Smartphone },
  ];

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-secondary-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <Monitor className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-secondary-900">
                    Virtual Device Manager
                  </h1>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-secondary-900">{user?.username}</p>
                <p className="text-xs text-secondary-600 capitalize">{user?.role}</p>
              </div>
              
              <div className="flex items-center gap-2">
                <button className="p-2 text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100 rounded-lg transition-colors">
                  <Settings className="w-5 h-5" />
                </button>
                
                <button
                  onClick={handleLogout}
                  className="p-2 text-secondary-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar - Only for Admin */}
        {isAdmin && (
          <motion.aside
            initial={{ x: -250 }}
            animate={{ x: 0 }}
            className="w-64 bg-white shadow-sm border-r border-secondary-200 min-h-[calc(100vh-4rem)]"
          >
            <nav className="p-4">
              <ul className="space-y-2">
                {adminNavItems.map((item) => {
                  const isActive = currentPath === item.path || 
                    (item.path === '/admin' && currentPath.startsWith('/admin') && currentPath.split('/').length === 2);
                  
                  return (
                    <li key={item.path}>
                      <button
                        onClick={() => navigate(item.path)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left ${
                          isActive
                            ? 'bg-primary-50 text-primary-700 border border-primary-200'
                            : 'text-secondary-600 hover:text-secondary-900 hover:bg-secondary-50'
                        }`}
                      >
                        <item.icon className="w-5 h-5" />
                        {item.label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </motion.aside>
        )}

        {/* Main Content */}
        <main className={`flex-1 ${isAdmin ? '' : 'max-w-7xl mx-auto'} p-6`}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
