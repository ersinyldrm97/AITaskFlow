import { Bell, Search } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  const { currentUser } = useAuthStore();

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
        <button className="relative p-2 text-slate-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
        </button>
        <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full flex items-center justify-center text-white text-xs font-bold">
          {currentUser?.avatar || currentUser?.name?.slice(0, 2).toUpperCase()}
        </div>
      </div>
    </header>
  );
}
