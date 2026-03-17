import { Bell, Search } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useNotificationStore } from '../../store/notificationStore';
import { useState } from 'react';
import NotificationDropdown from './NotificationDropdown';
import { AnimatePresence } from 'framer-motion';

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  const { currentUser } = useAuthStore();
  const { notifications } = useNotificationStore();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <header className="fixed top-0 right-0 left-[260px] h-16 bg-white/80 backdrop-blur-sm border-b border-slate-100 flex items-center justify-between px-6 z-20">
      <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Ara..."
            className="pl-9 pr-4 py-1.5 text-sm bg-slate-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 w-48 transition-all"
          />
        </div>
        <div className="relative">
          <button 
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className={`relative p-2 rounded-lg transition-all ${isNotificationsOpen ? 'bg-primary-50 text-primary-600 shadow-sm' : 'text-slate-500 hover:text-primary-600 hover:bg-primary-50'}`}
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-primary-600 text-white text-[8px] font-black flex items-center justify-center rounded-full border-2 border-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
          
          <AnimatePresence>
            {isNotificationsOpen && (
              <NotificationDropdown 
                isOpen={isNotificationsOpen} 
                onClose={() => setIsNotificationsOpen(false)} 
              />
            )}
          </AnimatePresence>
        </div>
        <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full flex items-center justify-center text-white text-xs font-bold ring-2 ring-white shadow-sm">
          {currentUser?.avatar || currentUser?.name?.slice(0, 2).toUpperCase()}
        </div>
      </div>
    </header>
  );
}
