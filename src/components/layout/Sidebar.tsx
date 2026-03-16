import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Users,
  Settings,
  Zap,
  Plus,
  ChevronDown,
  Building2,
  LogOut,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useState } from 'react';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/projects', icon: FolderKanban, label: 'Projeler' },
  { to: '/tasks', icon: CheckSquare, label: 'Görevler' },
  { to: '/team', icon: Users, label: 'Ekip' },
  { to: '/settings', icon: Settings, label: 'Ayarlar' },
];

export default function Sidebar() {
  const { currentUser, logout, currentWorkspace, workspaces, setWorkspace } = useAuthStore();
  const [isWsOpen, setIsWsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-[260px] bg-white border-r border-slate-100 flex flex-col z-30">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold text-slate-900">TaskFlow</span>
        </div>
      </div>

      {/* Workspace Switcher */}
      <div className="px-3 py-4 border-b border-slate-100 relative">
        <button 
          onClick={() => setIsWsOpen(!isWsOpen)}
          className="w-full flex items-center justify-between px-3 py-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all group"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-6 h-6 bg-white border border-slate-200 rounded-md flex items-center justify-center text-[10px] font-black text-primary-600 flex-shrink-0">
              {currentWorkspace?.name?.[0].toUpperCase() || 'W'}
            </div>
            <span className="text-sm font-bold text-slate-700 truncate">
              {currentWorkspace?.name || 'Workspace Seç'}
            </span>
          </div>
          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isWsOpen ? 'rotate-180' : ''}`} />
        </button>

        {isWsOpen && (
          <div className="absolute left-3 right-3 top-full mt-1 bg-white border border-slate-100 rounded-2xl shadow-xl shadow-slate-200/50 z-50 p-2 space-y-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2 py-1">Çalışma Alanların</p>
            <div className="max-h-[200px] overflow-y-auto pr-1">
              {workspaces.map(ws => (
                <button
                  key={ws.id}
                  onClick={() => {
                    setWorkspace(ws);
                    setIsWsOpen(false);
                    navigate('/dashboard');
                  }}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentWorkspace?.id === ws.id 
                      ? 'bg-primary-50 text-primary-600' 
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className={`w-5 h-5 rounded flex items-center justify-center text-[9px] font-bold ${
                    currentWorkspace?.id === ws.id ? 'bg-primary-500 text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {ws.name[0].toUpperCase()}
                  </div>
                  <span className="truncate">{ws.name}</span>
                </button>
              ))}
            </div>
            <div className="border-t border-slate-100 mt-1 pt-1">
              <button 
                onClick={() => {
                  navigate('/onboarding');
                  setIsWsOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 text-sm font-bold text-slate-500 hover:text-primary-600 hover:bg-slate-50 rounded-lg transition-all"
              >
                <Plus size={16} />
                Yeni Workspace
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto scrollbar-hide">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            <Icon className="w-4.5 h-4.5 flex-shrink-0" size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div className="p-3 border-t border-slate-100">
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {currentUser?.avatar || currentUser?.name?.slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-900 truncate">{currentUser?.name}</p>
            <p className="text-xs text-slate-400 truncate">{currentUser?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
            title="Çıkış yap"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  );
}
