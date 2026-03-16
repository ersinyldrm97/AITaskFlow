import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useNotificationStore } from '../../store/notificationStore';
import { UserPlus } from 'lucide-react';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuthStore();
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

  return (
    <>
      <h2 className="text-xl font-bold text-slate-900 mb-1">Hesap oluşturun</h2>
      <p className="text-sm text-slate-500 mb-6">Ücretsiz başlayın, kredi kartı gerekmez</p>

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
        <button type="submit" className="btn-primary w-full justify-center py-2.5" id="register-submit">
          <UserPlus size={16} />
          Kayıt Ol
        </button>
      </form>

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
