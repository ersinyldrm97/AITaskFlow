import { Outlet, useLocation } from 'react-router-dom';
import { Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from './PageTransition';

export default function AuthLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary-100/40 via-transparent to-transparent">
      <div className="w-full max-w-[440px]">
        <div className="flex flex-col items-center mb-8 gap-3">
          <motion.div 
            initial={{ scale: 0.8, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center shadow-xl shadow-primary-600/20"
          >
            <Zap className="text-white fill-white" size={24} />
          </motion.div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">TaskFlow</h1>
        </div>
        
        <AnimatePresence mode="wait">
          <PageTransition key={location.pathname}>
            <div className="premium-card p-8 glass">
              <Outlet />
            </div>
          </PageTransition>
        </AnimatePresence>
      </div>
    </div>
  );
}
