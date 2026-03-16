# Proje Yönetim SaaS Uygulaması

## Proje Hakkında

**Proje Adı:** TaskFlow - Proje Yönetim Platformu

**Amaç:** KOBİ'ler ve freelancer'lar için basit ama güçlü bir proje yönetim ve görev takip aracı. Aylık abonelik modeli ile gelir elde etmeyi hedefler.

**Hedef Kitle:**
- Türkiye'deki KOBİ'ler
- Freelancer'lar ve solo girişimciler
- Küçük dijital ajanslar

## Teknoloji Stack

```
Frontend: React 18 + TypeScript
Build: Vite
Styling: Tailwind CSS
State Management: Zustand
Routing: React Router DOM
Icons: Lucide React
```

**Neden Bu Teknolojiler?**
- React 18: En yaygın frontend framework, büyük ekosistem
- TypeScript: Tip güvenliği, kolay bakım
- Vite: Hızlı geliştirme, kolay güncelleme
- Tailwind CSS: Hızlı UI geliştirme, küçük bundle size
- Zustand: Basit API, React hooks entegrasyonu

## Özellikler

### MVP (Minimum Viable Product)

1. **Proje Yönetimi**
   - Proje oluşturma, düzenleme, silme
   - Proje durumu takibi (Aktif, Tamamlandı, Askıda)
   - Proje detayları ve açıklama

2. **Görev Yönetimi**
   - Gorev oluşturma, düzenleme, silme
   - Gorev durumu (Yapılacak, Devam Ediyor, Tamamlandı)
   - Gorev önceliği (Düşük, Orta, Yüksek)
   - Gorev atama

3. **Kurumsal Yapı**
   - Çalışan/Departman ekleme
   - Gorev atama sistemi

4. **Dashboard**
   - Genel istatistikler
   - Aktif projeler
   - Tamamlanan gorevler
   - Yaklaşan deadline'ler

5. **Kullanıcı Yönetimi**
   - Kayıt/Giriş sistemi (localStorage ile demo)
   - Profil yönetimi

### Premium Özellikler (Gelecek)

- Takvim entegrasyonu
- Raporlama ve analitik
- Dosya yükleme
- Ekip işbirliği araçları
- Mobil uygulama

## Sayfa Yapısı

```
/                   - Landing Page (Tanıtım)
/login              - Giriş yap
/register           - Kayıt ol
/dashboard          - Ana dashboard
/projects           - Projeler listesi
/projects/:id       - Proje detayı
/tasks              - Tüm görevler
/team               - Ekip yönetimi
/settings           - Ayarlar
```

## Renk Şeması

```
Primary: #6366F1 (Indigo-500)
Secondary: #8B5CF6 (Violet-500)
Accent: #10B981 (Emerald-500)
Background: #F8FAFC (Slate-50)
Dark: #1E293B (Slate-800)
```

## Veri Yapısı

```typescript
interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'on-hold';
  startDate: string;
  endDate: string;
  teamId: string;
  createdAt: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  projectId: string;
  assigneeId: string;
  dueDate: string;
  createdAt: string;
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}
```

## Kurulum

```bash
npm install
npm run dev
```

## Üretim Build

```bash
npm run build
```

## Notlar

- Şu an için veriler localStorage'da saklanıyor
- Gerçek uygulama için backend eklenebilir (Node.js/Supabase)
- PWA olarak mobilde kullanılabilir
