import React, { useContext } from 'react';
import { Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, GlobeLock, ShieldAlert, BarChart3, LogOut, Activity, Shield, Users } from 'lucide-react';

const Layout = () => {
  const { logout, user } = useContext(AuthContext);
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', name: 'Overview', icon: LayoutDashboard },
    { path: '/websites', name: 'Protected Sites', icon: GlobeLock },
    { path: '/security', name: 'Attack Monitor', icon: Activity },
    { path: '/reports', name: 'Reports', icon: BarChart3 },
    { path: '/website-users', name: 'Website Users', icon: Users },
  ];

  return (
    <div className="flex h-screen bg-cyber-900 text-gray-300 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-cyber-800 border-r border-cyber-600 flex flex-col relative shadow-[5px_0_20px_rgba(0,0,0,0.6)] flex-shrink-0">
        <div className="absolute top-0 right-0 w-[1px] h-full bg-gradient-to-b from-transparent via-cyber-primary/50 to-transparent" />

        <div className="px-6 py-6 flex items-center space-x-3 border-b border-cyber-600">
          <Shield className="text-cyber-primary w-8 h-8 glow-pulse flex-shrink-0" />
          <span className="text-xl font-bold tracking-wider text-white">THREAT<span className="text-cyber-primary">GUARD</span></span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 font-medium relative ${
                  isActive
                    ? 'bg-cyber-primary/10 text-cyber-primary border border-cyber-primary/30 shadow-[0_0_10px_rgba(0,240,255,0.1)]'
                    : 'text-gray-400 hover:bg-cyber-700/50 hover:text-white border border-transparent'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-cyber-primary' : ''} />
                <span className="text-sm font-mono">{item.name}</span>
                {isActive && (
                  <div className="absolute left-0 top-1/4 h-1/2 w-0.5 bg-cyber-primary rounded-r-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User info + logout */}
        <div className="p-4 border-t border-cyber-600">
          <div className="flex items-center space-x-3 px-4 py-3 mb-3 rounded-lg bg-cyber-900/50 border border-cyber-600">
            <div className="w-8 h-8 rounded-full bg-cyber-primary/20 flex items-center justify-center border border-cyber-primary/50 text-cyber-primary font-bold text-sm flex-shrink-0">
              {user?.name?.charAt(0).toUpperCase() || 'O'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white font-mono truncate">{user?.name || 'Owner'}</p>
              <p className="text-xs text-cyber-success font-mono truncate">{user?.email || ''}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center w-full space-x-3 px-4 py-2.5 rounded-lg text-cyber-danger/70 hover:text-cyber-danger hover:bg-cyber-danger/10 border border-transparent hover:border-cyber-danger/30 transition-all duration-300 font-mono text-sm"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-cyber-900 relative">
        <div className="absolute inset-0 bg-cyber-grid bg-[size:50px_50px] opacity-5 pointer-events-none" />
        <div className="relative z-10 p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
