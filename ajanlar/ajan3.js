/**
 * Ajan 3: Proaktif Görev ve Deadline Takipçisi
 * Görevi: Son tarihi (deadline) yaklaşan veya geçmiş görevleri tespit edip loglamak/uyarmak.
 * Çalıştırmak için: node ajanlar/ajan3.js
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL || '', process.env.VITE_SUPABASE_ANON_KEY || '');

async function runDeadlineScanner() {
  console.log('🤖 Ajan 3 Başlatıldı: Görev Kritiklik Taraması Yapılıyor...');
  console.log('--------------------------------------------------');
  
  try {
    const { data: tasks, error } = await supabase.from('tasks').select('title, due_date, status');
    
    if (error) throw error;
    
    if (!tasks || tasks.length === 0) {
      console.log('📋 Sistemde henüz kayıtlı bir görev bulunmamaktadır.');
      return;
    }

    let overdueCount = 0;
    const now = new Date();

    console.log('🔍 Riskli ve Geciken Görevler Listesi:');
    
    tasks.forEach(task => {
      if (task.status !== 'completed' && task.due_date) {
        const dueDate = new Date(task.due_date);
        
        if (dueDate < now) {
          const prefix = task.priority === 'high' ? '🔥 [KRİTİK GECİKMELİ]' : '⚠️  [GECİKTİ]';
          console.log(`${prefix} ${task.title} (Son Tarih: ${task.due_date})`);
          overdueCount++;
        } else {
          const diffDays = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));
          if (diffDays <= 3) {
            const importance = task.priority === 'high' ? '🚨 [ACİL]' : '🔔 [YAKLAŞIYOR]';
            console.log(`${importance} ${task.title} (Kalan Süre: ${diffDays} gün)`);
          }
        }
      }
    });

    console.log('\n📊 Tarama Özeti:');
    console.log(`Toplam Aktif Görev: ${tasks.filter(t => t.status !== 'completed').length}`);
    console.log(`Termini Geçmiş (Riskli) Görev Sayısı: ${overdueCount}`);
    
  } catch (err) {
    console.error('❌ HATA: Tarama yapılamadı.', err.message);
  }
  
  console.log('--------------------------------------------------');
  console.log('🤖 Ajan 3 Görevini Tamamladı.\n');
}

runDeadlineScanner();
