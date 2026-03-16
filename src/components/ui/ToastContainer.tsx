import { useNotificationStore } from '../../store/notificationStore';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function ToastContainer() {
  const { notifications, removeNotification } = useNotificationStore();

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
      {notifications.map((n) => (
        <div
          key={n.id}
          className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border min-w-[300px] animate-slide-in ${
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
            onClick={() => removeNotification(n.id)}
            className="p-1 hover:bg-black/5 rounded-lg transition-colors"
          >
            <X size={14} className="opacity-50" />
          </button>
        </div>
      ))}
    </div>
  );
}
