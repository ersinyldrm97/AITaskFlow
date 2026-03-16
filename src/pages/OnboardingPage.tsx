import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { Zap, Plus, ArrowRight, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';

export default function OnboardingPage() {
  const { createWorkspace, currentUser } = useAuthStore();
  const [workspaceName, setWorkspaceName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workspaceName.trim()) return;

    setIsLoading(true);
    const { error } = await createWorkspace(workspaceName);
    setIsLoading(false);

    if (!error) {
      navigate('/dashboard');
    } else {
      alert('Workspace oluşturulurken bir hata oluştu: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-10 border border-slate-100"
      >
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-200">
            <Zap className="text-white w-8 h-8" />
          </div>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Yeni Bir Başlangıç</h1>
          <p className="text-slate-500 mt-2 font-medium">Hoş geldin {currentUser?.name}! İlk çalışma alanını (Workspace) oluşturarak ekibini yönetmeye başla.</p>
        </div>

        <form onSubmit={handleCreate} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
              Çalışma Alanı İsmi
            </label>
            <div className="relative group">
              <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-primary-500 transition-colors" />
              <input
                type="text"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                placeholder="Örn: Acme Corp veya Tasarım Ekibi"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 group"
            isLoading={isLoading}
          >
            Workspace Oluştur
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </form>

        <p className="text-center text-xs text-slate-400 mt-8 font-medium">
          Daha sonra başka çalışma alanları oluşturabilir veya mevcut alanlara davet edilebilirsin.
        </p>
      </motion.div>
    </div>
  );
}
