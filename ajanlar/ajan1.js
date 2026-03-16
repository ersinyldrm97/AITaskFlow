/**
 * Ajan 1: Sistem Sağlığı ve Veritabanı Bağlantı Kontrolcüsü
 * Görevi: Backend (Supabase) ve API bağlantılarının ayakta olup olmadığını test etmek.
 * Çalıştırmak için: node ajanlar/ajan1.js
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function runHealthCheck() {
  console.log('🤖 Ajan 1 Başlatıldı: Sistem Sağlığı Kontrol Ediliyor...');
  console.log('--------------------------------------------------');
  
  try {
    const start = Date.now();
    // Basit bir sorgu atarak bağlantıyı test et
    const { data, error } = await supabase.from('projects').select('id').limit(1);
    const ms = Date.now() - start;

    if (error) {
      console.error('❌ HATA: Veritabanı bağlantısı kurulamadı!');
      console.error('Detay:', error.message);
    } else {
      console.log(`✅ BAŞARILI: Supabase bağlantısı aktif. (Yanıt süresi: ${ms}ms)`);
      console.log('Sistem tüm API isteklerine yanıt vermeye hazır durumda.');
    }
  } catch (err) {
    console.error('❌ KRİTİK HATA: İstek atılırken bir sorun oluştu.', err);
  }
  
  console.log('--------------------------------------------------');
  console.log('🤖 Ajan 1 Görevini Tamamladı.\n');
}

runHealthCheck();
