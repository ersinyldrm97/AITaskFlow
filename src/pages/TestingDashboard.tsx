import { motion } from 'framer-motion';
import { usePaymentStore } from '../store/paymentStore';
import { useAuthStore } from '../store/authStore';
import { RefreshCcw, Trash2, CreditCard, CheckCircle2, AlertCircle, History } from 'lucide-react';
import Button from '../components/ui/Button';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

export default function TestingDashboard() {
  const { currentPlan, transactions, resetAll, setPlan } = usePaymentStore();
  const { updateProfile, currentUser } = useAuthStore();

  const handleReset = async () => {
    await updateProfile({ plan: 'free' as any });
    resetAll();
    setPlan('free');
  };

  const forceUpgrade = async () => {
    await updateProfile({ plan: 'pro' as any });
    setPlan('pro');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col gap-2">
        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Test Paneli</h2>
        <p className="text-slate-500 font-medium text-lg">Ödeme ve abonelik akışlarını buradan simüle edin.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Subscription Control */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="premium-card p-8 space-y-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600">
              <RefreshCcw size={20} />
            </div>
            <h3 className="text-xl font-black text-slate-900">Abonelik Durumu</h3>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between border border-slate-100">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mevcut Plan</p>
              <p className="text-lg font-black text-slate-900 uppercase">{currentUser?.plan || 'Free'}</p>
            </div>
            <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
              currentUser?.plan === 'pro' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'
            }`}>
              {currentUser?.plan === 'pro' ? 'Aktif' : 'Pasif'}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" onClick={handleReset} className="border-slate-200 text-rose-500 hover:bg-rose-50">
              <Trash2 size={16} /> Reset (Free)
            </Button>
            <Button onClick={forceUpgrade}>
              <CheckCircle2 size={16} /> Force Pro
            </Button>
          </div>
        </motion.div>

        {/* Payment Configuration */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="premium-card p-8 space-y-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
              <CreditCard size={20} />
            </div>
            <h3 className="text-xl font-black text-slate-900">Ödeme Yapılandırması</h3>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Çalışma Modu</p>
              <div className="flex gap-2">
                {(['mock', 'stripe-test', 'stripe-live'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => usePaymentStore.getState().setPaymentMode(mode)}
                    className={`flex-1 py-2 text-[10px] font-black uppercase tracking-tight rounded-xl transition-all border-2 ${
                      usePaymentStore.getState().paymentMode === mode
                        ? 'bg-slate-900 text-white border-slate-900 shadow-lg'
                        : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'
                    }`}
                  >
                    {mode.split('-').pop()}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 bg-slate-900 rounded-2xl border border-white/10 text-white">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Aktif Test Kartları</p>
              <div className="space-y-2 font-mono text-xs font-bold">
                <div className="flex justify-between">
                  <span className="text-emerald-400">Success:</span>
                  <span>4242...4242</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-rose-400">Decline:</span>
                  <span>4000...0002</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Audit Logs */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="premium-card p-0 overflow-hidden"
      >
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-600">
              <History size={20} />
            </div>
            <h3 className="text-xl font-black text-slate-900">Güvenlik ve Denetim Kayıtları</h3>
          </div>
          <Button variant="ghost" className="text-[10px] font-black uppercase" onClick={resetAll}>Logları Temizle</Button>
        </div>

        <div className="max-h-[300px] overflow-y-auto scrollbar-hide">
          <div className="p-4 space-y-3">
            {usePaymentStore.getState().logs.length > 0 ? (
              usePaymentStore.getState().logs.map((log) => (
                <div key={log.id} className="flex gap-4 p-3 rounded-2xl bg-white border border-slate-50 shadow-sm">
                  <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${
                    log.level === 'error' ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]' :
                    log.level === 'warn' ? 'bg-amber-500' : 'bg-emerald-500'
                  }`} />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{log.event}</p>
                      <span className="text-[10px] font-medium text-slate-400">{format(new Date(log.timestamp), 'HH:mm:ss')}</span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium">{log.details}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-slate-300 italic text-sm">Henüz bir güvenlik kaydı oluşmadı.</div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Transaction History */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="premium-card p-0 overflow-hidden"
      >
        <div className="p-8 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-600">
              <CheckCircle2 size={20} />
            </div>
            <h3 className="text-xl font-black text-slate-900">İşlem Geçmişi (Frontend)</h3>
          </div>
          <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{transactions.length} Kayıt</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">ID</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Tarih</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Miktar</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Durum</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length > 0 ? (
                transactions.map((txn, i) => (
                  <tr key={txn.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-4 text-xs font-bold text-slate-600 font-mono">{txn.id}</td>
                    <td className="px-8 py-4 text-xs font-medium text-slate-500">
                      {format(new Date(txn.date), 'dd MMM yyyy, HH:mm', { locale: tr })}
                    </td>
                    <td className="px-8 py-4 text-sm font-black text-slate-900">${txn.amount}</td>
                    <td className="px-8 py-4">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        txn.status === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                      }`}>
                        {txn.status === 'success' ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                        {txn.status === 'success' ? 'Başarılı' : 'Hata'}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center">
                    <p className="text-sm font-bold text-slate-300 uppercase tracking-widest">Henüz bir işlem yok</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
