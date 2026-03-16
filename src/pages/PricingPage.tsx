import { motion } from 'framer-motion';
import { Check, Zap, Star, Shield, Rocket, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';

export default function PricingPage() {
  const navigate = useNavigate();

  const plans = [
    {
      name: 'Free',
      price: '0',
      description: 'Yeni başlayanlar ve bireysel kullanıcılar için.',
      features: [
        '3 Aktif Proje',
        'Temel Görev Yönetimi',
        'Ekip Üyeleri (Max 2)',
        'Temel İstatistikler',
        'Topluluk Desteği'
      ],
      buttonText: 'Mevcut Plan',
      buttonVariant: 'outline' as const,
      popular: false,
    },
    {
      name: 'Pro',
      price: '9.99',
      description: 'Profesyonel ekipler ve hızlı büyüyen projeler için.',
      features: [
        'Sınırsız Proje',
        'Gelişmiş AI Asistanı',
        'Sınırsız Ekip Üyesi',
        'Detaylı Analiz Raporları',
        '7/24 Öncelikli Destek',
        'Özel Tema Modları'
      ],
      buttonText: 'Pro\'ya Yükselt',
      buttonVariant: 'primary' as const,
      popular: true,
    }
  ];

  const handleUpgrade = (planName: string) => {
    if (planName === 'Pro') {
      // Future: Stripe Integration will trigger here
      alert('Stripe ödeme sistemine yönlendiriliyorsunuz... (Demo aşamasında olduğu için simüle ediliyor)');
      
      // Simulate Stripe Redirect Delay
      setTimeout(() => {
        navigate('/success');
      }, 1500);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 text-primary-600 text-xs font-black uppercase tracking-widest"
          >
            <Star size={14} className="fill-primary-500" />
            Üyelik Planları
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight"
          >
            Potansiyelinizi <span className="text-primary-600">TaskFlow Pro</span> ile Serbest Bırakın
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 text-lg font-medium"
          >
            Ekibiniz için en uygun planı seçin ve hemen üretkenliğinizi ikiye katlayın.
          </motion.p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className={`p-10 flex flex-col relative overflow-hidden rounded-3xl border transition-all duration-500 hover:-translate-y-1 ${
                plan.popular 
                  ? 'bg-slate-900 text-white border-slate-800 shadow-2xl shadow-primary-500/10 ring-1 ring-white/10' 
                  : 'bg-white text-slate-900 border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-primary-600/5'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-1 -right-1 overflow-hidden w-32 h-32 pointer-events-none">
                  <div className="bg-primary-600 text-white text-[10px] font-black uppercase tracking-widest py-1.5 w-[150%] absolute top-8 left-[-10%] rotate-45 shadow-lg text-center">
                    En Popüler
                  </div>
                </div>
              )}

              <div className="mb-8 relative z-10">
                <h3 className="text-2xl font-black tracking-tight mb-2">
                  {plan.name}
                </h3>
                <p className={`text-sm font-medium ${plan.popular ? 'text-slate-400' : 'text-slate-500'}`}>
                  {plan.description}
                </p>
              </div>

              <div className="mb-10 relative z-10">
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black tracking-tighter">
                    ${plan.price}
                  </span>
                  <span className={`text-sm font-bold ${plan.popular ? 'text-indigo-300' : 'text-slate-400'}`}>
                    /aylık
                  </span>
                </div>
              </div>

              <div className="flex-1 space-y-4 mb-10">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                      plan.popular ? 'bg-primary-500/20 text-primary-400' : 'bg-primary-50 text-primary-600'
                    }`}>
                      <Check size={12} strokeWidth={4} />
                    </div>
                    <span className={`text-sm font-semibold ${plan.popular ? 'text-slate-300' : 'text-slate-600'}`}>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              <Button
                onClick={() => handleUpgrade(plan.name)}
                variant={plan.buttonVariant}
                className={`w-full py-4 h-auto text-xs font-black uppercase tracking-[0.2em] rounded-2xl transition-all ${
                  plan.popular 
                    ? 'bg-primary-600 hover:bg-primary-500 text-white shadow-xl shadow-primary-600/30' 
                    : 'border-slate-200 text-slate-900 hover:bg-slate-50'
                }`}
              >
                {plan.buttonText}
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Multi-Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-slate-200"
        >
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="p-3 bg-white rounded-2xl shadow-sm text-primary-600">
              <Shield size={24} />
            </div>
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Güvenli Ödeme</h4>
            <p className="text-xs text-slate-500 font-medium">Stripe altyapısı ile 256-bit şifreli ödeme.</p>
          </div>
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="p-3 bg-white rounded-2xl shadow-sm text-primary-600">
              <Rocket size={24} />
            </div>
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Anında Aktivasyon</h4>
            <p className="text-xs text-slate-500 font-medium">Ödeme sonrası tüm özellikler saniyeler içinde açılır.</p>
          </div>
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="p-3 bg-white rounded-2xl shadow-sm text-primary-600">
              <Star size={24} />
            </div>
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Memnuniyet Garantisi</h4>
            <p className="text-xs text-slate-500 font-medium">İlk 14 gün koşulsuz şartsız iade imkanı.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
