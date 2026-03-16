import { useTeamStore } from '../store/teamStore';
import { 
  Plus, 
  Mail, 
  Briefcase, 
  Search, 
  MoreVertical,
  ExternalLink,
  Shield,
  Trash2
} from 'lucide-react';
import { useState } from 'react';
import Modal from '../components/ui/Modal';
import { useNotificationStore } from '../store/notificationStore';
import type { TeamMember } from '../types';

export default function TeamPage() {
  const { members, addMember, deleteMember } = useTeamStore();
  const { notify } = useNotificationStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');

  // Form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [department, setDepartment] = useState('Yazılım');

  const filteredMembers = members.filter((m: TeamMember) => 
    m.name.toLowerCase().includes(search.toLowerCase()) || 
    m.role.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMember({ name, email, role, department });
    notify(`${name} ekibe davet edildi`);
    setIsModalOpen(false);
    setName('');
    setEmail('');
    setRole('');
  };
  
  const handleDeleteMember = (id: string, name: string) => {
    if (confirm(`${name} ekibinden çıkarılacak. Emin misiniz?`)) {
      deleteMember(id);
      notify('Ekip üyesi çıkarıldı', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:items-center sm:flex-row justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Ekip Üyeleri</h2>
          <p className="text-slate-500 text-sm">Ekibinizde {members.length} kişi bulunuyor.</p>
        </div>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} />
          Yeni Üye Ekle
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4.5 h-4.5" />
        <input
          type="text"
          placeholder="Ekipte ara..."
          className="input pl-10"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map((m: TeamMember) => (
          <div key={m.id} className="card p-6 hover:border-primary-200 transition-all group relative">
            <button className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-900 opacity-0 group-hover:opacity-100 transition-opacity">
              <MoreVertical size={16} />
            </button>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-primary-600 rounded-2xl flex items-center justify-center text-lg font-bold text-white shadow-lg">
                {m.avatar}
              </div>
              <div>
                <h3 className="font-bold text-slate-900 group-hover:text-primary-600 transition-colors">{m.name}</h3>
                <p className="text-xs text-slate-500 font-medium">{m.role}</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-slate-600">
                <Mail size={14} className="text-slate-400" />
                <span className="text-xs">{m.email}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <Briefcase size={14} className="text-slate-400" />
                <span className="text-xs">{m.department}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <Shield size={14} className="text-slate-400" />
                <span className="text-[10px] font-bold bg-slate-100 px-2 py-0.5 rounded-full uppercase text-slate-500 tracking-wider">Member</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
              <button className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1.5">
                Profili Gör <ExternalLink size={12} />
              </button>
              <button 
                onClick={() => handleDeleteMember(m.id, m.name)}
                className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                title="Üyeyi Çıkar"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Yeni Ekip Üyesi Davet Et">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Ad Soyad</label>
            <input className="input" placeholder="Örn: Mehmet Öz" required value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div>
            <label className="label">E-posta</label>
            <input type="email" className="input" placeholder="kullanici@sirket.com" required value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="label">Pozisyon</label>
            <input className="input" placeholder="Örn: Lead Design" required value={role} onChange={e => setRole(e.target.value)} />
          </div>
          <div>
            <label className="label">Departman</label>
            <select className="input" value={department} onChange={e => setDepartment(e.target.value)}>
              <option value="Yazılım">Yazılım</option>
              <option value="Tasarım">Tasarım</option>
              <option value="Pazarlama">Pazarlama</option>
              <option value="Satış">Satış</option>
              <option value="İK">İK</option>
            </select>
          </div>
          <div className="pt-4 flex gap-3">
            <button type="button" className="btn-secondary flex-1 justify-center" onClick={() => setIsModalOpen(false)}>İptal</button>
            <button type="submit" className="btn-primary flex-1 justify-center">Daveti Gönder</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
