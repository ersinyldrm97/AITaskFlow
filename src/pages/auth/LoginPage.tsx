import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useNotificationStore } from '../../store/notificationStore';
import { Eye, EyeOff, Zap, Loader2, Github, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuthStore();
  const { notify } = useNotificationStore();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const { error: loginError } = await login(email, password);
      setIsLoading(false);
      
      if (!loginError) {
        notify('Giriş başarılı. Hoş geldiniz!');
        navigate('/dashboard');
      } else {
        let errorMsg = loginError.message;
        
        if (loginError.message === 'Invalid login credentials') {
          errorMsg = 'E-posta veya şifre hatalı.';
        } else if (loginError.message === 'Email not confirmed') {
          errorMsg = 'Lütfen e-posta adresinizi onaylayın. Onay linki için gelen kutunuzu kontrol edin.';
        }
        
        setError(errorMsg);
        notify(errorMsg, 'error');
      }
    } catch (err: any) {
      setIsLoading(false);
      const msg = 'Bağlantı hatası oluştu.';
      setError(msg);
      notify(msg, 'error');
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl font-black text-slate-900 mb-1 tracking-tight">Hoş geldiniz!</h2>
        <p className="text-sm text-slate-500 mb-6 font-medium">Lütfen bilgilerinizi girerek oturum açın</p>
      </motion.div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">E-posta</label>
          <input
            type="email"
            className="input"
            placeholder="ornek@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            id="login-email"
          />
        </div>
        <div>
          <label className="label">Şifre</label>
          <div className="relative">
            <input
              type={showPass ? 'text' : 'password'}
              className="input pr-10"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              id="login-password"
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
            <span className="text-slate-500 group-hover:text-slate-700 transition-colors">Beni Hatırla</span>
          </label>
          <button type="button" className="text-primary-600 hover:text-primary-700 font-semibold transition-colors">
            Şifremi Unuttum
          </button>
        </div>

        <motion.button 
          whileTap={{ scale: 0.98 }}
          disabled={isLoading}
          type="submit" 
          className="btn-primary w-full justify-center py-3.5 relative overflow-hidden group shadow-xl shadow-primary-600/20 disabled:opacity-70" 
          id="login-submit"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Zap size={18} className="group-hover:scale-110 transition-transform" />
              <span className="font-bold tracking-wide">Giriş Yap</span>
            </>
          )}
        </motion.button>
      </form>

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-100"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase tracking-widest font-black">
          <span className="bg-white/50 px-4 text-slate-400 backdrop-blur-sm">veya şununla devam et</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <button className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-slate-100 rounded-xl hover:bg-slate-50 hover:border-slate-200 transition-all font-semibold text-slate-700 shadow-sm active:scale-95">
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4 grayscale group-hover:grayscale-0" />
          Google
        </button>
        <button className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-slate-100 rounded-xl hover:bg-slate-50 hover:border-slate-200 transition-all font-semibold text-slate-700 shadow-sm active:scale-95">
          <Github size={18} />
          GitHub
        </button>
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-slate-500">
          Hesabınız yok mu?{' '}
          <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">
            Kayıt ol
          </Link>
        </p>
      </div>

      <div className="mt-5 p-3 bg-slate-50 rounded-lg">
        <p className="text-xs text-slate-400 text-center">Demo Girişi için lütfen kayıt olun veya mevcut hesabınızı kullanın.</p>
      </div>
    </>
  );
}
