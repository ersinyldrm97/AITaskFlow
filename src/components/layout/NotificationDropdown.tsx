import { useNotificationStore } from '../../store/notificationStore';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, Trash2, Check, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';

export default function NotificationDropdown({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const { notifications, markAllAsRead, clearAll, removeNotification } = useNotificationStore();

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-30" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        className="absolute top-14 right-0 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-40"
      >
        <div className="p-4 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Bildirimler</h3>
          <div className="flex gap-2">
            <button 
              onClick={markAllAsRead}
              className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-white rounded-lg transition-all"
              title="Tümünü oku"
            >
              <Check size={14} />
            </button>
            <button 
              onClick={clearAll}
              className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-white rounded-lg transition-all"
              title="Tümünü temizle"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        <div className="max-h-[400px] overflow-y-auto scrollbar-hide">
          <AnimatePresence initial={false}>
            {notifications.length > 0 ? (
              notifications.map((n) => (
                <motion.div
                  key={n.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className={`p-4 border-b border-slate-50 flex gap-3 hover:bg-slate-50 transition-colors relative group ${!n.isRead ? 'bg-indigo-50/30' : ''}`}
                >
                  <div className={`mt-0.5 w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    n.type === 'success' ? 'bg-emerald-50 text-emerald-500' :
                    n.type === 'error' ? 'bg-rose-50 text-rose-500' :
                    'bg-blue-50 text-blue-500'
                  }`}>
                    {n.type === 'success' && <CheckCircle2 size={16} />}
                    {n.type === 'error' && <AlertCircle size={16} />}
                    {n.type === 'info' && <Info size={16} />}
                  </div>

                  <div className="flex-1 space-y-1">
                    <p className={`text-xs leading-relaxed ${!n.isRead ? 'font-bold text-slate-900' : 'text-slate-600'}`}>
                      {n.message}
                    </p>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                      <Clock size={10} />
                      <span>{formatDistanceToNow(new Date(n.createdAt), { addSuffix: true, locale: tr })}</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => removeNotification(n.id)}
                    className="p-1 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity self-start"
                  >
                    <Trash2 size={12} />
                  </button>
                  
                  {!n.isRead && (
                    <div className="absolute top-4 right-10 w-2 h-2 bg-primary-500 rounded-full" />
                  )}
                </motion.div>
              ))
            ) : (
              <div className="p-10 text-center">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-200 mx-auto mb-3">
                  <Clock size={24} />
                </div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest italic">Bildirim Bulunmuyor</p>
              </div>
            )}
          </AnimatePresence>
        </div>

        {notifications.length > 0 && (
          <div className="p-3 bg-slate-50/50 border-t border-slate-100 text-center">
            <button className="text-[10px] font-black uppercase tracking-widest text-primary-600 hover:text-primary-700 transition-colors">
              Tüm Bildirimleri Gör
            </button>
          </div>
        )}
      </motion.div>
    </>
  );
}
