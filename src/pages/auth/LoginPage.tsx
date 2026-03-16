import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useNotificationStore } from '../../store/notificationStore';
import { Eye, EyeOff, Zap } from 'lucide-react';

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
    
    const { error: loginError } = await login(email, password);
    setIsLoading(false);
    
    if (!loginError) {
      notify('Giriş başarılı. Hoş geldiniz!');
      navigate('/dashboard');
    } else {
      setError('E-posta veya şifre hatalı.');
    }
  };

  return (
    <>
      <h2 className="text-xl font-bold text-slate-900 mb-1">Hoş geldiniz!</h2>
      <p className="text-sm text-slate-500 mb-6">Hesabınıza giriş yapın</p>

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
        <button type="submit" className="btn-primary w-full justify-center py-2.5" id="login-submit">
          <Zap size={16} />
          Giriş Yap
        </button>
      </form>

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
