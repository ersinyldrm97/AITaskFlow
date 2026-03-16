-- 0. Gerekli eklenti
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Bağımlılıkları Temizle (Politikalar tablo silinmesini engelliyor)
DROP POLICY IF EXISTS "pj_manage_v2" ON projects;
DROP POLICY IF EXISTS "tk_manage_v2" ON tasks;
DROP POLICY IF EXISTS "pr_all_v2" ON profiles;

-- 2. Tabloyu Güvenli Bir Şekilde Sil ve Yeniden Oluştur
DROP TABLE IF EXISTS workspace_members CASCADE;

CREATE TABLE workspace_members (
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    role TEXT CHECK (role IN ('admin', 'member')) DEFAULT 'member',
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (workspace_id, user_id)
);

-- 3. RLS Politikalarını YENİDEN KUR (Döngüsüz ve Hata Vermeyen Versiyon)

-- WORKSPACE_MEMBERS
ALTER TABLE workspace_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "members_select_v4" ON workspace_members FOR SELECT USING (true);
CREATE POLICY "members_insert_v4" ON workspace_members FOR INSERT WITH CHECK (auth.uid() = user_id);

-- WORKSPACES
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "ws_select_v2" ON workspaces;
DROP POLICY IF EXISTS "ws_insert_v2" ON workspaces;
CREATE POLICY "ws_select_v4" ON workspaces FOR SELECT USING (true);
CREATE POLICY "ws_insert_v4" ON workspaces FOR INSERT WITH CHECK (auth.uid() = owner_id);

-- PROJECTS & TASKS (Bağımlılıklar buraya gelir)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "pj_manage_v4" ON projects FOR ALL USING (
    workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid())
);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tk_manage_v4" ON tasks FOR ALL USING (
    workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid())
);

-- PROFILES
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "pr_all_v4" ON profiles FOR ALL USING (true);

-- 4. Mevcut Kullanıcıları Tekrar Ekle (Kayıp Yaşamamak İçin)
INSERT INTO workspace_members (workspace_id, user_id, role)
SELECT id, owner_id, 'admin' FROM workspaces
ON CONFLICT DO NOTHING;
