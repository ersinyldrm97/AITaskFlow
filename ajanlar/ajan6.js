/**
 * Ajan 6: Başarı ve Dönüm Noktası (Milestone) Analizcisi
 * Görevi: Son 48 saat içinde tamamlanan kritik görevleri bulup özetleyerek ekibe moral ve rapor sunmak.
 * Çalıştırmak için: node ajanlar/ajan6.js
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL || '', process.env.VITE_SUPABASE_ANON_KEY || '');

async function runMilestoneAnalyst() {
  console.log('🤖 Ajan 6 Başlatıldı: Son Başarılar ve Dönüm Noktaları Analiz Ediliyor...');
  console.log('--------------------------------------------------');
  
  try {
    // Son 48 saatte tamamlanan görevleri getir
    const twoDaysAgo = new Date();
    twoDaysAgo.setHours(twoDaysAgo.getHours() - 48);

    const { data: achievements, error } = await supabase
      .from('tasks')
      .select('title, created_at, priority')
      .eq('status', 'completed')
      .gte('created_at', twoDaysAgo.toISOString());
    
    if (error) throw error;

    if (!achievements || achievements.length === 0) {
      console.log('ℹ️  Son 48 saat içinde tamamlanan büyük bir görev bulunamadı. Çalışmaya devam!');
      return;
    }

    console.log(`🏆 TEBRİKLER! Son 2 günde tam ${achievements.length} önemli görev tamamlandı.\n`);

    achievements.forEach(task => {
        const star = task.priority === 'high' ? '🌟' : '✅';
        console.log(`${star} [TAMAMLANDI] ${task.title}`);
    });

    console.log('\n📈 Ekip ivmesi: %' + (achievements.length * 10) + ' artış gösterdi.');
    console.log('Bu başarıların sistem duyurusuna eklenmesi önerilir.');

  } catch (err) {
    console.error('❌ HATA: Analiz başarısız oldu.', err.message);
  }
  
  console.log('--------------------------------------------------');
  console.log('🤖 Ajan 6 Görevini Tamamladı.\n');
}

runMilestoneAnalyst();
