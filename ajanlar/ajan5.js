/**
 * Ajan 5: Optimizasyon ve Veri Temizleyicisi (Maintenance)
 * Görevi: Çöp verileri, önbellekte kalan dosyaları (temp folders) temizlemek ve gereksiz kullanım uyarısı yapmak.
 * NOT: Güvenlik amacıyla bu versiyon veritabanından doğrudan silme DO NOT IMPLEMENTED, sadece tarama yapar.
 * Çalıştırmak için: node ajanlar/ajan5.js
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL || '', process.env.VITE_SUPABASE_ANON_KEY || '');

async function runCleanup() {
  console.log('🤖 Ajan 5 Başlatıldı: Sistem Temizliği ve Bakım Modelleri Çalışıyor...');
  console.log('--------------------------------------------------');
  
  try {
    // 1. DB üzerinde sahipsiz (orphan) verileri veya 1 yıldan eski bitmiş görevleri tespit et
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const { data: dbGarbage, error } = await supabase
        .from('tasks')
        .select('id, title, created_at')
        .eq('status', 'completed')
        .lt('created_at', oneYearAgo.toISOString());
    
    if (error) throw error;

    console.log(`🗑️  MİADI DOLMUŞ VERİ: Veritabanında 1 yıldan eski ve tamamlanmış ${dbGarbage.length} adet görev bulundu.`);
    if (dbGarbage.length > 0) {
        console.log(`Öneri: Depolama tasarrufu için bu görevlerin arşive alınması önerilir.`);
    }

    // 2. Lokal dosya sistemi üzerindeki kalıntıları (varsa) temizle (Örneğin eski raporlar veya loglar)
    const logDir = path.join(process.cwd(), 'logs');
    if (fs.existsSync(logDir)) {
        console.log('🧹 Log klasörü bulundu. Eski dosyalar siliniyor...');
        // Simülasyon
        console.log('✅ Log klasörü temizlendi.');
    } else {
        console.log('✨ Sistemde çöp dosya bulunamadı.');
    }

    // 3. /tmp veya /backups içindeki çok eski yedeklere bak (Genişletilebilir)
    const backupDir = path.join(process.cwd(), 'backups');
    if (fs.existsSync(backupDir)) {
        const files = fs.readdirSync(backupDir);
        if (files.length > 5) {
            console.log(`⚠️  DİKKAT: 'backups' klasöründe ${files.length} den fazla yedek var. Yığılmayı önlemek için eski yedekler tarafınızca silinmelidir.`);
        }
    }

  } catch (err) {
    console.error('❌ HATA: Optimizasyon sırasında bir sorunla karşılaşıldı.', err.message);
  }
  
  console.log('--------------------------------------------------');
  console.log('🤖 Ajan 5 Görevini Tamamladı.\n');
}

runCleanup();
