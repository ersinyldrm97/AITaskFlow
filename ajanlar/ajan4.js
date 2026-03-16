/**
 * Ajan 4: Günlük Veri Analizi ve Özet Raporlayıcısı
 * Görevi: Kaç projenin aktif, kaçının tamamlandığı ve takımın mevcut iş yükünü özet çıkarıp loglamak.
 * Çalıştırmak için: node ajanlar/ajan4.js
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL || '', process.env.VITE_SUPABASE_ANON_KEY || '');

async function generateAnalytics() {
  console.log('🤖 Ajan 4 Başlatıldı: Veri Analizi ve Metrikler Çıkarılıyor...');
  console.log('--------------------------------------------------');
  
  try {
    const { data: projects, error: projErr } = await supabase.from('projects').select('status');
    const { data: tasks, error: taskErr } = await supabase.from('tasks').select('status, priority');

    if (projErr || taskErr) throw new Error('Verilere ulaşılamadı');

    // Analiz Hesaplamaları
    const totalProjects = projects.length;
    const completedProjects = projects.filter(p => p.status === 'completed').length;
    const activeProjects = projects.filter(p => p.status === 'active').length;

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const highPriorityTasks = tasks.filter(t => t.priority === 'high' && t.status !== 'completed').length;

    const taskCompletionRate = totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(1) : 0;

    const report = `
📊 TASKFLOW SİSTEM ÖZET RAPORU 📊
Oluşturulma Tarihi: ${new Date().toLocaleString('tr-TR')}

[Projeler]
- Toplam Proje: ${totalProjects}
- Aktif Geliştirilen: ${activeProjects}
- Tamamlanan: ${completedProjects}

[Görevler]
- Toplam Görev: ${totalTasks}
- Bitirilen Görev: ${completedTasks}
- Başarı Oranı: %${taskCompletionRate}
- Acil Bekleyen Görevler (High Priority): ${highPriorityTasks}

🎯 Yorum: ${highPriorityTasks > 5 ? 'Acil görev sayısı çok yüksek. Ekiplere bildirim yapılması önerilir.' : 'İş yükü dengeli görünüyor.'}
`;

    // Konsola bas
    console.log(report);
    
    // Raporu dosyaya da kaydet
    const reportDir = path.join(process.cwd(), 'reports');
    if (!fs.existsSync(reportDir)) fs.mkdirSync(reportDir);
    
    const fileName = path.join(reportDir, `report_${Date.now()}.txt`);
    fs.writeFileSync(fileName, report);

    console.log(`✅ BAŞARILI: Rapor ${fileName} konumuna kaydedildi.`);
  } catch (err) {
    console.error('❌ HATA: Raporlama yapılamadı.', err.message);
  }
  
  console.log('--------------------------------------------------');
  console.log('🤖 Ajan 4 Görevini Tamamladı.\n');
}

generateAnalytics();
