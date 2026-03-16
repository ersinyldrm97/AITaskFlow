import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useNotificationStore } from '../../store/notificationStore';
import { UserPlus, Loader2, Github } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register, signInWithSocial } = useAuthStore();
  const { notify } = useNotificationStore();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password.length < 6) {
      const msg = 'Şifre en az 6 karakter olmalıdır.';
      setError(msg);
      notify(msg, 'error');
      return;
    }

    setIsLoading(true);
    try {
      const { error: registerError } = await register(name, email, password);
      setIsLoading(false);

      if (!registerError) {
        notify('Hesabınız başarıyla oluşturuldu!');
        navigate('/dashboard');
      } else {
        const msg = registerError.message || 'Kayıt sırasında bir hata oluştu.';
        setError(msg);
        notify(msg, 'error');
      }
    } catch (err: any) {
      setIsLoading(false);
      const msg = 'Sunucuyla bağlantı kurulamadı.';
      setError(msg);
      notify(msg, 'error');
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    const { error: socialError } = await signInWithSocial(provider);
    if (socialError) {
      notify(socialError.message, 'error');
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl font-black text-slate-900 mb-1 tracking-tight">Hesap oluşturun</h2>
        <p className="text-sm text-slate-500 mb-6 font-medium">Ücretsiz başlayın, kredi kartı gerekmez</p>
      </motion.div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Ad Soyad</label>
          <input
            type="text"
            className="input"
            placeholder="Ad Soyad"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            id="register-name"
          />
        </div>
        <div>
          <label className="label">E-posta</label>
          <input
            type="email"
            className="input"
            placeholder="ornek@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            id="register-email"
          />
        </div>
        <div>
          <label className="label">Şifre</label>
          <input
            type="password"
            className="input"
            placeholder="En az 6 karakter"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            id="register-password"
          />
        </div>
        <motion.button 
          whileTap={{ scale: 0.98 }}
          disabled={isLoading}
          type="submit" 
          className="btn-primary w-full justify-center py-3.5 relative overflow-hidden group shadow-xl shadow-primary-600/20 disabled:opacity-70" 
          id="register-submit"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <UserPlus size={18} className="group-hover:scale-110 transition-transform" />
              <span className="font-bold tracking-wide">Kayıt Ol</span>
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
        <button 
          onClick={() => handleSocialLogin('google')}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-slate-100 rounded-xl hover:bg-slate-50 hover:border-slate-200 transition-all font-semibold text-slate-700 shadow-sm active:scale-95 group"
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4 grayscale group-hover:grayscale-0" />
          Google
        </button>
        <button 
          onClick={() => handleSocialLogin('github')}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-slate-100 rounded-xl hover:bg-slate-50 hover:border-slate-200 transition-all font-semibold text-slate-700 shadow-sm active:scale-95"
        >
          <Github size={18} />
          GitHub
        </button>
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-slate-500">
          Zaten hesabınız var mı?{' '}
          <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
            Giriş yap
          </Link>
        </p>
      </div>
    </>
  );
}
