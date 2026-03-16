import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Zap, ChevronLeft } from 'lucide-react';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-[#030712] text-white selection:bg-primary-500/30 font-sans">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/10 blur-[150px]" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+CjxwYXRoIGQ9Ik0wIDBoNDB2NDBIMHoiIGZpbGw9Im5vbmUiLz4KPHBhdGggZD0iTTAgMGg0MHY0MEgweiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utb3BhY2l0eT0iMC4wNSIvPgo8L3N2Zz4=')] opacity-30" />
      </div>

      <nav className="fixed top-0 w-full z-50 bg-[#030712]/50 backdrop-blur-2xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-primary-500/20">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">TaskFlow</span>
          </Link>
          <Link to="/" className="text-sm font-medium text-white/60 hover:text-white flex items-center gap-2 transition-colors">
            <ChevronLeft size={16} /> Geri Dön
          </Link>
        </div>
      </nav>

      <main className="relative z-10 pt-40 pb-24 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-8">Kullanım Şartları</h1>
            <p className="text-white/50 mb-12 italic">Son güncelleme: 16 Mart 2026</p>

            <div className="space-y-10 prose prose-invert prose-primary max-w-none text-white/80">
              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">1. Kabul</h2>
                <p>
                  AITaskFlow platformuna erişerek ve kullanarak, bu şartlara ve tüm yasal yükümlülüklere bağlı kalmayı kabul etmiş sayılırsınız.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">2. Hesap Güvenliği</h2>
                <p>
                  Hesap bilgilerinizin ve şifrenizin gizliliğini korumak sizin sorumluluğunuzdadır. Hesabınız altında gerçekleşen tüm faaliyetlerden siz sorumlu tutulursunuz.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">3. Hizmet Kullanımı</h2>
                <p>
                  Platformu aşağıdaki amaçlar için kullanamazsınız:
                </p>
                <ul className="list-disc pl-6 mt-4 space-y-2">
                  <li>Yasa dışı veya etik olmayan içerik barındırmak</li>
                  <li>Sisteme zarar verecek yazılımlar yüklemek</li>
                  <li>Diğer kullanıcıların hizmet almasını engellemek</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">4. Fikri Mülkiyet</h2>
                <p>
                  AITaskFlow logosu, tasarımı, kaynak kodları ve tüm marka öğeleri AITaskFlow Digital firmasına aittir. İzinsiz kopyalanamaz veya dağıtılamaz.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">5. Değişiklik Hakları</h2>
                <p>
                  Bu şartları dilediğimiz zaman güncelleme hakkını saklı tutarız. Önemli değişikliklerde kullanıcılarımıza bildirim gönderilecektir.
                </p>
              </section>
            </div>
          </motion.div>
        </div>
      </main>

      <footer className="relative z-10 border-t border-white/10 py-12 px-6">
        <div className="max-w-7xl mx-auto text-center text-white/40 text-sm">
          © 2026 AITaskFlow Digital. Tüm hakları saklıdır.
        </div>
      </footer>
    </div>
  );
}
