import { useNotificationStore } from '../../store/notificationStore';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ToastContainer() {
  const { notifications, removeNotification } = useNotificationStore();
  const [visibleToasts, setVisibleToasts] = useState<string[]>([]);

  // Show only most recent notification as a toast
  const latestNotification = notifications[0];

  useEffect(() => {
    if (latestNotification && !visibleToasts.includes(latestNotification.id)) {
      setVisibleToasts(prev => [...prev, latestNotification.id]);
      
      const timer = setTimeout(() => {
        setVisibleToasts(prev => prev.filter(id => id !== latestNotification.id));
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [latestNotification]);

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {notifications.filter(n => visibleToasts.includes(n.id)).map((n) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border min-w-[300px] ${
              n.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' :
              n.type === 'error' ? 'bg-rose-50 border-rose-100 text-rose-800' :
              'bg-blue-50 border-blue-100 text-blue-800'
            }`}
          >
            {n.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
            {n.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-500" />}
            {n.type === 'info' && <Info className="w-5 h-5 text-blue-500" />}
            
            <p className="text-sm font-semibold flex-1">{n.message}</p>
            
            <button
              onClick={() => setVisibleToasts(prev => prev.filter(id => id !== n.id))}
              className="p-1 hover:bg-black/5 rounded-lg transition-colors"
            >
              <X size={14} className="opacity-50" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
