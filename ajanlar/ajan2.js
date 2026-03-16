/**
 * Ajan 2: Gece Yarısı Veri Yedekleme (Backup) Asistanı
 * Görevi: Uygulamadaki önemli tablo verilerini lokal bir JSON nesnesine aktarıp yedeklemek.
 * Çalıştırmak için: node ajanlar/ajan2.js
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL || '', process.env.VITE_SUPABASE_ANON_KEY || '');

async function runBackup() {
  console.log('🤖 Ajan 2 Başlatıldı: Cloud Veri Yedeklemesi Alınıyor...');
  console.log('--------------------------------------------------');
  
  try {
    const backupData = {};
    
    // Projeleri yedekle
    console.log('⏳ Projeler tablosu çekiliyor...');
    const { data: projects } = await supabase.from('projects').select('*');
    backupData.projects = projects || [];
    
    // Görevleri yedekle
    console.log('⏳ Görevler tablosu çekiliyor...');
    const { data: tasks } = await supabase.from('tasks').select('*');
    backupData.tasks = tasks || [];
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupDir = path.join(process.cwd(), 'backups');
    
    // Klasör yoksa oluştur
    if (!fs.existsSync(backupDir)){
        fs.mkdirSync(backupDir, { recursive: true });
    }
    
    const fileName = path.join(backupDir, `backup_${timestamp}.json`);
    fs.writeFileSync(fileName, JSON.stringify(backupData, null, 2));

    console.log(`✅ BAŞARILI: Veriler güvenli bir şekilde yedeklendi.`);
    console.log(`📂 Konum: ${fileName}`);
    console.log(`📈 Toplam Kayıt: ${backupData.projects.length} Proje, ${backupData.tasks.length} Görev`);
  } catch (err) {
    console.error('❌ HATA: Yedekleme işlemi başarısız oldu.', err.message);
  }
  
  console.log('--------------------------------------------------');
  console.log('🤖 Ajan 2 Görevini Tamamladı.\n');
}

runBackup();
