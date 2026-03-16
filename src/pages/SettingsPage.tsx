import { useAuthStore } from '../store/authStore';
import { Link } from 'react-router-dom';
import { 
  User, 
  Bell, 
  Lock, 
  Moon, 
  CreditCard,
  Save,
  Camera,
  Check,
  ChevronRight,
  Zap
} from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/ui/Button';

export default function SettingsPage() {
  const { currentUser, updateProfile } = useAuthStore();
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaved(false);
    
    // Simulate API delay for premium feel
    setTimeout(() => {
      updateProfile({ name, email });
      setIsSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 800);
  };

  const menuItems = [
    { id: 'profile', icon: User, label: 'Profil' },
    { id: 'notifications', icon: Bell, label: 'Bildirimler' },
    { id: 'security', icon: Lock, label: 'Güvenlik' },
    { id: 'display', icon: Moon, label: 'Görünüm' },
    { id: 'billing', icon: CreditCard, label: 'Abonelik' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto space-y-8 pb-12"
    >
      <div className="flex flex-col gap-2">
        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Ayarlar</h2>
        <p className="text-slate-500 font-medium">Hesap ve uygulama tercihlerinizi buradan yönetin.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3 space-y-2">
          {menuItems.map((item, i) => (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-black transition-all border-0 ${
                item.id === 'profile' 
                  ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/10 active:scale-95' 
                  : 'text-slate-500 hover:bg-white hover:text-slate-900 hover:shadow-sm'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </motion.button>
          ))}
        </div>

        {/* Setting Content */}
        <div className="lg:col-span-9 space-y-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="premium-card p-10 glass relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <User size={160} />
            </div>

            <h3 className="text-xl font-black text-slate-900 mb-8 relative z-10">Profil Bilgileri</h3>
            
            <div className="flex flex-col sm:flex-row items-center gap-8 mb-10 pb-10 border-b border-slate-100/50 relative z-10">
              <div className="relative group cursor-pointer">
                <div className="w-28 h-28 bg-gradient-to-br from-primary-500 to-indigo-600 rounded-[2rem] flex items-center justify-center text-3xl font-black text-white shadow-2xl shadow-primary-500/30 group-hover:scale-105 transition-transform duration-500">
                  {currentUser?.name?.split(' ').map(n => n[0]).join('') || 'AY'}
                </div>
                <div className="absolute -bottom-2 -right-2 p-2 bg-white border border-slate-100 rounded-xl text-slate-900 shadow-xl group-hover:bg-slate-900 group-hover:text-white transition-all">
                  <Camera size={16} />
                </div>
              </div>
              <div className="text-center sm:text-left">
                <h4 className="text-2xl font-black text-slate-900 tracking-tight">{currentUser?.name}</h4>
                <div className="inline-flex items-center gap-2 mt-2 px-3 py-1 rounded-full bg-primary-50 text-primary-600 text-[10px] font-black uppercase tracking-widest">
                  <Check size={12} /> {currentUser?.role}
                </div>
              </div>
            </div>

            <form onSubmit={handleSave} className="space-y-8 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Ad Soyad</label>
                  <input 
                    className="input h-14 text-base font-bold bg-slate-50/50 border-slate-100/50 focus:bg-white focus:border-primary-500 transition-all" 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    required 
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">E-posta Adresi</label>
                  <input 
                    className="input h-14 text-base font-bold bg-slate-50/50 border-slate-100/50 focus:bg-white focus:border-primary-500 transition-all" 
                    type="email" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    required 
                  />
                </div>
              </div>
              
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Hakkında</label>
                <textarea 
                  className="input min-h-[140px] py-4 text-sm font-medium leading-relaxed bg-slate-50/50 border-slate-100/50 focus:bg-white focus:border-primary-500 transition-all" 
                  placeholder="Kendinizden bahsedin..." 
                  defaultValue="TaskFlow ekibinde vizyoner bir Proje Yöneticisi olarak görev almaktayım." 
                />
              </div>

              <div className="pt-6 flex justify-end">
                <Button 
                  type="submit" 
                  className="px-12 py-4 h-auto text-sm font-black uppercase tracking-widest shadow-2xl shadow-primary-600/30" 
                  disabled={isSaving}
                >
                  <AnimatePresence mode="wait">
                    {saved ? (
                      <motion.span 
                        key="saved"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="flex items-center gap-2 text-emerald-300"
                      >
                        <Check size={18} /> Kaydedildi
                      </motion.span>
                    ) : (
                      <motion.span 
                        key="save"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-2"
                      >
                        {isSaving ? 'Kaydediliyor...' : <><Save size={18} /> Ayarları Kaydet</>}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Button>
              </div>
            </form>
          </motion.div>

          {/* Integration or Billing Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="premium-card p-10 bg-slate-900 text-white border-0 overflow-hidden relative"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-[80px]" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-600/10 rounded-full translate-x-1/2 translate-y-1/2 blur-[60px]" />

            <div className="flex items-center justify-between mb-8 relative z-10">
              <div>
                <h3 className="text-xl font-black tracking-tight">Üyelik Durumu</h3>
                <p className="text-sm text-slate-400 font-medium mt-1">Şu an Ücretsiz Plan'dasınız.</p>
              </div>
              <span className="px-4 py-1.5 rounded-xl bg-white/10 text-white text-[10px] font-black uppercase tracking-[0.2em] border border-white/5">Free</span>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
              <p className="text-sm text-slate-300 max-w-md font-medium">
                Yeni nesil özellikler, sınırsız ekip ve gelişmiş raporlama için hemen Pro'ya yükseltin.
              </p>
              <Link to="/pricing" className="w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.05, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full sm:w-auto group relative inline-flex items-center justify-center gap-3 bg-white text-slate-950 px-10 py-4.5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all duration-300 shadow-[0_0_40px_rgba(99,102,241,0.4)] hover:shadow-[0_0_60px_rgba(99,102,241,0.6)]"
                >
                  {/* Animated Gradient Border Layer */}
                  <div className="absolute -inset-[2px] rounded-2xl bg-gradient-to-r from-primary-500 via-indigo-400 to-purple-500 opacity-70 group-hover:opacity-100 blur-[1px] group-hover:blur-[2px] transition-all duration-500 animate-gradient-x" />
                  
                  {/* Primary Button Surface */}
                  <div className="relative w-full h-full flex items-center justify-center gap-3 bg-white rounded-[14px] px-8 py-4 z-10">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">Planlara Göz At</span>
                    <div className="relative">
                      <Zap size={16} className="text-primary-500 fill-primary-500 animate-pulse" />
                      <ChevronRight size={16} className="absolute inset-0 opacity-0 group-hover:opacity-100 group-hover:translate-x-4 transition-all duration-300 text-primary-600" />
                    </div>
                  </div>

                  {/* Shimmer Effect */}
                  <div className="absolute inset-0 w-full h-full overflow-hidden rounded-2xl z-20 pointer-events-none">
                    <div className="w-[100px] h-full bg-white/20 skew-x-[-20deg] absolute -left-full group-hover:animate-shimmer" />
                  </div>
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
