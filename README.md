# 🚀 AITaskFlow

AITaskFlow, modern işletmeler ve ekipler için tasarlanmış, **Supabase** backend desteği ve **Yapay Zeka Ajanları** ile güçlendirilmiş, ultra-premium bir proje ve görev yönetim platformudur.

![AITaskFlow Banner](https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2070)

## ✨ Özellikler

- **💎 Ultra-Premium UI:** Glassmorphism ve modern karanlık tema (Dark Mode) ile göz alıcı kullanıcı deneyimi.
- **⚡ Real-time Veritabanı:** Supabase entegrasyonu ile tüm veriler anlık olarak senkronize edilir.
- **🤖 Otonom Ajanlar:** Arka planda çalışan 5 farklı yardımcı ajan (Sistem sağlığı, Yedekleme, Deadline takibi, Raporlama, Bakım).
- **📈 Bento-Grid Dashboard:** Verilerinizi ve projelerinizi modern bir "Bento" yapısında inceleyin.
- **🔐 Güvenli Kimlik Doğrulama:** Supabase Auth ile güvenli giriş ve kayıt sistemleri.
- **📁 Proje Yönetimi:** Sürükle-bırak (Drag & Drop) destekli Kanban tahtası ve detaylı proje takibi.

## 🤖 AI Ajanlar Sistemi

`ajanlar/` klasörü altında bulunan proaktif betikler:

1.  **Ajan 1 (Health):** Sistem ve veritabanı bağlantı sağlığını denetler.
2.  **Ajan 2 (Backup):** Verileri anlık olarak yerel JSON formatında yedekler.
3.  **Ajan 3 (Deadline):** Yaklaşan ve geciken görevleri tespit edip raporlar.
4.  **Ajan 4 (Analytics):** Performans metriklerini ve günlük sistem özetini çıkarır.
5.  **Ajan 5 (Maintenance):** Sistem temizliği ve optimizasyon önerileri sunar.

## 🛠️ Kurulum

Projeyi yerelinizde çalıştırmak için:

1.  **Depoyu kopyalayın:**

    ```bash
    git clone https://github.com/ersinyldrm97/AITaskFlow.git
    cd AITaskFlow
    ```

2.  **Bağımlılıkları yükleyin:**

    ```bash
    npm install
    ```

3.  **Çevresel değişkenleri (.env) ayarlayın:**
    Kök dizinde bir `.env` dosyası oluşturun ve Supabase bilgilerinizi ekleyin:

    ```env
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  **Uygulamayı başlatın:**
    ```bash
    npm run dev
    ```

## 🚀 Ajanları Çalıştırma

Herhangi bir ajanı bağımsız olarak şu komutla tetikleyebilirsiniz:

```bash
node ajanlar/ajan1.js
```

## 🏛️ Mimari

- **Frontend:** React 18, Vite, Tailwind CSS, Framer Motion
- **State Management:** Zustand
- **Backend:** Supabase (PostgreSQL, Auth, RLS)
- **Icons:** Lucide React

---

⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!
© 2026 **AITaskFlow Digital** - Visionaries için tasarlandı.
