import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Lock, CreditCard, X, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { usePaymentStore } from '../../store/paymentStore';
import { useAuthStore } from '../../store/authStore';
import Button from '../ui/Button';

interface StripeCheckoutMockProps {
  isOpen: boolean;
  onClose: () => void;
  planName: 'Pro';
  amount: string;
}

export default function StripeCheckoutMock({ isOpen, onClose, planName, amount }: StripeCheckoutMockProps) {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [step, setStep] = useState<'form' | 'processing' | 'success' | 'error'>('form');
  const [errorMessage, setErrorMessage] = useState('');
  
  const { setPlan, addTransaction, addLog } = usePaymentStore();
  const { updateProfile } = useAuthStore();

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep('processing');
    addLog('Payment Started', `User initiated payment for ${planName} ($${amount})`);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2500));

    // Simple validation logic (Mocking Stripe card handling)
    if (cardNumber.replace(/\s/g, '') === '4242424242424242') {
      // Success
      addLog('Payment Validation Success', 'Mock card 4242 recognized.');
      await updateProfile({ plan: 'pro' as any });
      setPlan('pro');
      addTransaction({
        amount: parseFloat(amount),
        status: 'success',
        plan: 'pro'
      });
      addLog('Account Upgraded', 'User profile updated to pro in database.');
      setStep('success');
      
      // Auto close after success
      setTimeout(() => {
        onClose();
        window.location.href = '/success';
      }, 2000);
    } else if (cardNumber.includes('0002')) {
      // Intentional failure test
      const err = 'Kart reddedildi. Lütfen başka bir kart deneyin.';
      setErrorMessage(err);
      addLog('Payment Validation Failed', `Card ending in 0002. Error: ${err}`, 'error');
      addTransaction({
        amount: parseFloat(amount),
        status: 'failed',
        plan: 'pro',
        error: err
      });
      setStep('error');
    } else {
      // Generic failure
      const err = 'Ödeme işlenirken bir hata oluştu.';
      setErrorMessage(err);
      addLog('Payment System Error', err, 'error');
      setStep('error');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={step === 'form' ? onClose : undefined}
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-[480px] bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row"
      >
        {/* Left Side: Summary (Hidden on small mobile) */}
        <div className="w-[180px] bg-slate-50 p-8 border-r border-slate-100 hidden md:block">
          <div className="space-y-6">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white font-black text-xs">TF</div>
            <div className="space-y-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ödeme Yapılıyor</p>
              <h4 className="text-xl font-black text-slate-900">TaskFlow {planName}</h4>
              <p className="text-2xl font-black text-primary-600">${amount}</p>
            </div>
          </div>
        </div>

        {/* Right Side: Form / Status */}
        <div className="flex-1 p-8 md:p-10">
          {step === 'form' && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-black text-slate-900">Kart Bilgileri</h3>
                <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                  <X size={20} className="text-slate-400" />
                </button>
              </div>

              <form onSubmit={handlePayment} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Kart Numarası</label>
                  <div className="relative">
                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      required
                      type="text"
                      placeholder="4242 4242 4242 4242"
                      value={cardNumber}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^\d]/g, '');
                        const formatted = val.match(/.{1,4}/g)?.join(' ') || val;
                        setCardNumber(formatted);
                      }}
                      maxLength={19}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-primary-500 focus:bg-white outline-none transition-all font-mono font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Son Kullanma</label>
                    <input
                      required
                      type="text"
                      placeholder="MM/YY"
                      value={expiry}
                      onChange={(e) => {
                        let val = e.target.value.replace(/[^\d]/g, '');
                        if (val.length >= 2) {
                          val = val.substring(0, 2) + '/' + val.substring(2, 4);
                        }
                        setExpiry(val);
                      }}
                      maxLength={5}
                      className="w-full px-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-primary-500 focus:bg-white outline-none transition-all font-mono font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">CVC</label>
                    <div className="relative">
                      <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input
                        required
                        type="password"
                        placeholder="123"
                        value={cvc}
                        onChange={(e) => setCvc(e.target.value)}
                        maxLength={3}
                        className="w-full px-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-primary-500 focus:bg-white outline-none transition-all font-mono font-bold"
                      />
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full py-5 h-auto text-sm font-black uppercase tracking-widest shadow-xl shadow-primary-600/30">
                  Şimdi Öde - ${amount}
                </Button>
              </form>

              <div className="flex items-center justify-center gap-6 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2 grayscale opacity-50">
                  <Shield size={14} className="text-slate-400" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Stripe Secure</span>
                </div>
              </div>
            </div>
          )}

          {step === 'processing' && (
            <div className="h-full flex flex-col items-center justify-center py-20 space-y-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              >
                <Loader2 size={48} className="text-primary-600" />
              </motion.div>
              <div className="text-center">
                <h3 className="text-xl font-black text-slate-900">İşlem Yapılıyor</h3>
                <p className="text-sm text-slate-500 font-medium">Lütfen tarayıcıyı kapatmayın...</p>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="h-full flex flex-col items-center justify-center py-20 space-y-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center text-white"
              >
                <CheckCircle2 size={32} />
              </motion.div>
              <div className="text-center">
                <h3 className="text-xl font-black text-slate-900">Ödeme Başarılı</h3>
                <p className="text-sm text-slate-500 font-medium font-tr">Yönlendiriliyorsunuz..</p>
              </div>
            </div>
          )}

          {step === 'error' && (
            <div className="h-full flex flex-col items-center justify-center py-20 space-y-6">
              <div className="w-16 h-16 bg-rose-500 rounded-full flex items-center justify-center text-white">
                <AlertCircle size={32} />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-black text-slate-900">Ödeme Başarısız</h3>
                <p className="text-sm text-rose-500 font-bold">{errorMessage}</p>
              </div>
              <Button variant="outline" onClick={() => setStep('form')} className="px-8 border-slate-200">
                Tekrar Dene
              </Button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
