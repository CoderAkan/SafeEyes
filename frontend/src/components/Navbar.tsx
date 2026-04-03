import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LayoutDashboard, Camera, LogOut, Shield } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/cameras', label: 'Cameras', icon: Camera },
  ];

  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : 'U';

  return (
    <nav className="fixed top-0 left-0 right-0 h-[64px] flex items-center justify-between px-8 bg-bg-card border-b border-border-default z-50">
      <Link to="/" className="flex items-center gap-3 text-xl font-bold text-text-primary hover:text-accent-primary transition-colors duration-150">
        <div className="w-9 h-9 bg-accent-primary rounded-md flex items-center justify-center text-[1.1rem] text-white">
          <Shield size={20} />
        </div>
        SafeEyes
      </Link>

      <div className="flex items-center gap-2">
        {navItems.map(({ path, label, icon: Icon }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-150
                ${isActive 
                  ? 'bg-bg-card-hover text-accent-primary font-bold' 
                  : 'text-text-secondary hover:bg-bg-card-hover hover:text-text-primary'
                }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </div>

      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-accent-secondary flex items-center justify-center text-[0.85rem] font-semibold text-white">
          {initials}
        </div>
        <button 
          onClick={logout} 
          title="Logout"
          className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-text-secondary bg-transparent border-none cursor-pointer transition-all duration-150 hover:bg-bg-card hover:text-text-primary"
        >
          <LogOut size={18} />
        </button>
      </div>
    </nav>
  );
}
