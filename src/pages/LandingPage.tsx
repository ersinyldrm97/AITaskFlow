import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Zap, 
  Layers, 
  Workflow, 
  Shield, 
  Activity, 
  Globe, 
  ArrowRight,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';

const Badge = ({ children }: { children: React.ReactNode }) => (
  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/70 text-xs font-semibold backdrop-blur-md mb-8">
    <span className="flex h-2 w-2 rounded-full border border-primary-500 bg-primary-500/50 animate-pulse" />
    {children}
  </div>
);

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#030712] text-white selection:bg-primary-500/30 font-sans overflow-x-hidden">
      {/* Abstract Background Effect */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary-600/20 blur-[150px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/20 blur-[150px]" />
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+CjxwYXRoIGQ9Ik0wIDBoNDB2NDBIMHoiIGZpbGw9Im5vbmUiLz4KPHBhdGggZD0iTTAgMGg0MHY0MEgweiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utb3BhY2l0eT0iMC4wNSIvPgo8L3N2Zz4=')] opacity-30" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#030712]/50 backdrop-blur-2xl border-b border-white/5 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between pointer-events-auto">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-primary-500/20">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">TaskFlow</span>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden md:flex items-center gap-8"
          >
            <a href="#features" className="text-sm font-medium text-white/60 hover:text-white transition-colors">Özellikler</a>
            <a href="#pricing" className="text-sm font-medium text-white/60 hover:text-white transition-colors">Fiyatlandırma</a>
            <Link to="/login" className="text-sm font-medium text-white/60 hover:text-white transition-colors">Giriş Yap</Link>
            <Link to="/register">
              <button className="px-5 py-2.5 rounded-lg bg-white text-black font-semibold text-sm hover:scale-105 active:scale-95 transition-all duration-200">
                Başlayın
              </button>
            </Link>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-32 lg:pt-52 lg:pb-40 z-10 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            <Badge>TaskFlow 2.0 Yayında</Badge>
            <h1 className="text-5xl md:text-7xl lg:text-[84px] font-bold tracking-tight leading-[1.05] mb-8">
              Şirketinizin Geleceğini <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-indigo-400 to-purple-400">
                Yeniden Şekillendirin.
              </span>
            </h1>
            <p className="max-w-2xl text-lg md:text-xl text-white/50 mb-12 font-medium leading-relaxed">
              Kavram karmaşasına son. Doğrusal, hızlı ve güçlü yapısıyla projelerinizi pürüzsüzce ileriye taşıyın. İş akışınız hiç bu kadar estetik olmamıştı.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link to="/register" className="w-full sm:w-auto group">
                <button className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white text-black font-bold flex items-center justify-center gap-2 hover:bg-white/90 transition-all hover:scale-105 active:scale-95">
                  Ücretsiz Deneyin <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <Link to="/login" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/5 font-semibold border border-white/10 hover:bg-white/10 transition-all hover:scale-105 active:scale-95">
                  Platformu İncele
                </button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1, ease: "easeOut" }}
            className="mt-28 relative max-w-5xl mx-auto"
          >
            {/* Glow behind image */}
            <div className="absolute inset-x-10 top-1/2 -translate-y-1/2 h-1/2 bg-gradient-to-r from-primary-500/30 to-purple-500/30 blur-[100px] -z-10" />
            
            <div className="rounded-2xl md:rounded-[2.5rem] border border-white/10 bg-[#0a0a0a]/80 backdrop-blur-xl p-2 md:p-4 shadow-2xl shadow-black">
              <div className="rounded-xl md:rounded-[2rem] overflow-hidden border border-white/5 bg-[#121212] relative group">
                <img 
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2070" 
                  alt="App Interface Preview" 
                  className="w-full h-auto opacity-70 group-hover:opacity-100 transition-opacity duration-700"
                />
                
                {/* Simulated UI Overlays */}
                <div className="absolute top-1/4 left-8 bg-black/60 backdrop-blur-md border border-white/10 p-4 rounded-2xl hidden md:flex items-center gap-4 shadow-2xl animate-bounce" style={{animationDuration: '4s'}}>
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <CheckCircle2 className="text-emerald-400" size={20} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">Görev Tamamlandı</div>
                    <div className="text-xs text-white/50">Tasarım Revizyonu</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section id="features" className="py-24 relative z-10 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">Her Şey, İhtiyacınız Olan Yerde.</h2>
            <p className="text-white/50 text-lg">Fazlalıklardan arındırılmış, sadece hıza ve üretkenliğe odaklanan yeni nesil yönetim araçları.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
            {/* Large Card */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="md:col-span-2 md:row-span-2 rounded-3xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 p-8 flex flex-col justify-between relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 rounded-full blur-[80px] group-hover:bg-primary-500/20 transition-colors duration-500" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-6">
                  <Workflow className="text-primary-400" size={24} />
                </div>
                <h3 className="text-2xl font-bold mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r from-primary-400 to-indigo-400 transition-all">Sınırsız Akış</h3>
                <p className="text-white/50 font-medium leading-relaxed max-w-md">Çoklu projeleri, büyük ekipleri ve dar zaman çizelgelerini tek bir düzlemde pürüzsüzce senkronize edin.</p>
              </div>
              <div className="relative z-10 w-full h-32 mt-8 rounded-xl bg-black/40 border border-white/5 flex items-center justify-center overflow-hidden">
                 <div className="flex gap-4 items-center w-[150%] animate-[slide_20s_linear_infinite] opacity-30">
                    {[1,2,3,4,5].map(i => (
                      <div key={i} className="h-16 w-48 rounded-lg bg-white/5 border border-white/10 shadow-lg" />
                    ))}
                 </div>
              </div>
            </motion.div>

            <motion.div whileHover={{ y: -5 }} className="rounded-3xl bg-white/5 border border-white/10 p-8 relative overflow-hidden group">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-6">
                <Activity className="text-emerald-400" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">Canlı Veri</h3>
              <p className="text-white/50 text-sm">Gecikme yok. Ekibinizin her hareketi saniyesinde ekranınızda.</p>
            </motion.div>

            <motion.div whileHover={{ y: -5 }} className="rounded-3xl bg-white/5 border border-white/10 p-8 relative overflow-hidden group">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-6">
                <Layers className="text-amber-400" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">Modüler Yapı</h3>
              <p className="text-white/50 text-sm">Sadece kullandığınız özellikleri açık tutarak zihninizi boşaltın.</p>
            </motion.div>

            <motion.div whileHover={{ y: -5 }} className="md:col-span-2 rounded-3xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-white/10 p-8 relative overflow-hidden group flex flex-col justify-center">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-6">
                <Globe className="text-indigo-400" size={24} />
              </div>
              <h3 className="text-2xl font-bold mb-3">Evrensel Erişim</h3>
              <p className="text-white/50 max-w-md">Tüm cihazlarda (Desktop, Web, Mobil) aynı kusursuz deneyimi yaşayın. Hızdan ödün vermek yok.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 relative z-10 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Adil ve Net.</h2>
            <p className="text-white/50 text-lg">Süpriz ücretler yok. İhtiyacınız olan boyutu seçin.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <motion.div whileHover={{ y: -5 }} className="rounded-[2rem] bg-white/5 border border-white/10 p-10 flex flex-col">
              <h3 className="text-xl font-medium text-white/70 mb-2">Başlangıç</h3>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-5xl font-bold">Ücretsiz</span>
              </div>
              <p className="text-white/50 text-sm mb-8 pb-8 border-b border-white/10">Bireysel kullanıcılar için harika bir başlangıç noktası.</p>
              
              <ul className="space-y-4 mb-auto">
                <li className="flex items-center gap-3 text-sm text-white/80"><CheckCircle2 className="text-white/40" size={18} /> 3 Proje</li>
                <li className="flex items-center gap-3 text-sm text-white/80"><CheckCircle2 className="text-white/40" size={18} /> Temel Analizler</li>
                <li className="flex items-center gap-3 text-sm text-white/30"><CheckCircle2 className="text-white/10" size={18} /> Sınırlı Ekip Yönetimi</li>
              </ul>

              <Link to="/register" className="mt-10">
                <button className="w-full py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-colors">
                  Hemen Başla
                </button>
              </Link>
            </motion.div>

            <motion.div whileHover={{ y: -5 }} className="rounded-[2rem] bg-gradient-to-b from-[#1E293B] to-[#0F172A] border border-primary-500/30 p-10 flex flex-col relative overflow-hidden shadow-2xl shadow-primary-500/20">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary-400 to-indigo-500" />
              <div className="absolute top-10 right-10 px-3 py-1 rounded-full bg-primary-500/20 text-primary-300 text-xs font-bold uppercase">Pro</div>
              
              <h3 className="text-xl font-medium text-white/70 mb-2">Studio</h3>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-5xl font-bold">$29</span>
                <span className="text-white/50">/ ay</span>
              </div>
              <p className="text-white/50 text-sm mb-8 pb-8 border-b border-white/10">Büyüyen ekipler ve işletmeler için sınırsız güç.</p>
              
              <ul className="space-y-4 mb-auto">
                <li className="flex items-center gap-3 text-sm text-white"><CheckCircle2 className="text-primary-400" size={18} /> Sınırsız Proje & Görev</li>
                <li className="flex items-center gap-3 text-sm text-white"><CheckCircle2 className="text-primary-400" size={18} /> Gelişmiş İzinler</li>
                <li className="flex items-center gap-3 text-sm text-white"><CheckCircle2 className="text-primary-400" size={18} /> Öncelikli Destek</li>
                <li className="flex items-center gap-3 text-sm text-white"><CheckCircle2 className="text-primary-400" size={18} /> Özel Entegrasyonlar</li>
              </ul>

              <Link to="/register" className="mt-10">
                <button className="w-full py-3.5 rounded-xl bg-white text-black hover:bg-white/90 font-bold transition-colors">
                  Pro'ya Geçin
                </button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Layer */}
      <section className="py-32 relative z-10 px-6">
        <div className="max-w-5xl mx-auto border border-white/10 rounded-[3rem] p-12 md:p-24 text-center bg-white/5 backdrop-blur-3xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary-500/10 to-transparent" />
          
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 relative z-10">Artık daha iyisini hak ediyorsunuz.</h2>
          <p className="text-white/50 text-xl font-medium mb-10 max-w-2xl mx-auto relative z-10">
            Kredi kartı gerekmez. Saniyeler içinde kurun ve ekibinizi davet edin. 
          </p>
          <Link to="/register" className="inline-block relative z-10">
            <button className="px-10 py-5 rounded-2xl bg-white text-black font-bold text-lg hover:scale-105 transition-transform active:scale-95 flex items-center gap-3 mx-auto">
              Ücretsiz Deneyin <ChevronRight size={20} />
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold tracking-tight">TaskFlow</span>
          </div>
          
          <div className="flex gap-8 text-sm text-white/40">
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
            <a href="#" className="hover:text-white transition-colors">GitHub</a>
            <a href="#" className="hover:text-white transition-colors">Gizlilik</a>
            <a href="#" className="hover:text-white transition-colors">Şartlar</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
