import { motion } from 'framer-motion';
import { PartyPopper, ArrowRight, CheckCircle2, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import { useEffect } from 'react';

export default function SuccessPage() {
  const navigate = useNavigate();

  // In a real app, we would verify the session here
  useEffect(() => {
    // confetti effect could be triggered here
  }, []);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-8">
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", damping: 12 }}
          className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/20"
        >
          <PartyPopper size={40} className="text-white" />
        </motion.div>

        <div className="space-y-3">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-black text-slate-900 tracking-tight"
          >
            Tebrikler, Artık <span className="text-primary-600">Pro</span>'sunuz!
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-slate-500 font-medium leading-relaxed"
          >
            Ödemeniz başarıyla tamamlandı. TaskFlow Pro'nun tüm sınırsız özellikleri hesabınıza tanımlandı.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-slate-50 rounded-3xl p-6 border border-slate-100 space-y-4"
        >
          <div className="flex items-center gap-3 text-sm font-bold text-slate-700">
            <CheckCircle2 size={18} className="text-emerald-500" />
            Sınırsız proje oluşturma aktif
          </div>
          <div className="flex items-center gap-3 text-sm font-bold text-slate-700">
            <CheckCircle2 size={18} className="text-emerald-500" />
            AI Ajan özellikleri açıldı
          </div>
          <div className="flex items-center gap-3 text-sm font-bold text-slate-700">
            <CheckCircle2 size={18} className="text-emerald-500" />
            Öncelikli destek hattı
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="pt-4"
        >
          <Button 
            onClick={() => navigate('/dashboard')}
            className="w-full py-4 h-auto group bg-slate-900 text-white hover:bg-black rounded-2xl shadow-xl shadow-slate-900/10"
          >
            Dashboard'a Dön
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>

        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
          Fatura bilgileriniz e-posta adresinize gönderildi.
        </p>
      </div>
    </div>
  );
}
