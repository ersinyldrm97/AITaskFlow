import { useState, useEffect } from 'react';
import { useTaskStore } from '../store/taskStore';
import { useProjectStore } from '../store/projectStore';
import { useTeamStore } from '../store/teamStore';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Calendar,
  CheckSquare,
  AlertCircle,
  Flag
} from 'lucide-react';
import Modal from '../components/ui/Modal';
import { useNotificationStore } from '../store/notificationStore';
import type { Project, Task, TeamMember } from '../types';

export default function TasksPage() {
  const { tasks, addTask, updateTask, deleteTask, fetchTasks } = useTaskStore();
  const { projects, fetchProjects } = useProjectStore();
  const { members, fetchMembers } = useTeamStore();
  const { notify } = useNotificationStore();

  useEffect(() => {
    fetchTasks();
    fetchProjects();
    fetchMembers();
  }, [fetchTasks, fetchProjects, fetchMembers]);

  
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form
  const [title, setTitle] = useState('');
  const [projectId, setProjectId] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [assigneeId, setAssigneeId] = useState('');
  const [dueDate, setDueDate] = useState('');

  const filteredTasks = tasks.filter((t: Task) => {
    const matchesFilter = filter === 'all' || t.status === filter;
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTask({
      title,
      description: '',
      status: 'todo',
      priority,
      projectId,
      assigneeId,
      dueDate,
    });
    notify('Görev başarıyla oluşturuldu');
    setIsModalOpen(false);
    setTitle('');
  };
  
  const handleToggleStatus = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'completed' ? 'todo' : 'completed';
    updateTask(id, { status: newStatus });
    notify(newStatus === 'completed' ? 'Görev tamamlandı' : 'Görev beklemeye alındı', newStatus === 'completed' ? 'success' : 'info');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Tüm Görevler</h2>
          <p className="text-slate-500 text-sm">{tasks.length} toplam görev yönetiliyor.</p>
        </div>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} />
          Hızlı Görev Ekle
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4.5 h-4.5" />
          <input
            type="text"
            placeholder="Görev ara..."
            className="input pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          {['all', 'todo', 'in-progress', 'completed'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all capitalize ${
                filter === f 
                  ? 'bg-slate-900 text-white' 
                  : 'bg-white text-slate-500 border border-slate-200 hover:border-slate-300'
              }`}
            >
              {f === 'all' ? 'Tümü' : f === 'in-progress' ? 'Devam' : f === 'todo' ? 'Yapılacak' : 'Bitti'}
            </button>
          ))}
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Görev</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Öncelik</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Bağlı Proje</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Atanan</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Teslim</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Durum</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredTasks.map((t: Task) => {
                const project = projects.find((p: Project) => p.id === t.projectId);
                const assignee = members.find((m: TeamMember) => m.id === t.assigneeId);
                return (
                  <tr key={t.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => handleToggleStatus(t.id, t.status)}
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                            t.status === 'completed' ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-200 bg-white'
                          }`}
                        >
                          {t.status === 'completed' && <Plus size={12} className="rotate-45" />}
                        </button>
                        <span className={`text-sm font-semibold ${t.status === 'completed' ? 'text-slate-400 line-through' : 'text-slate-900'}`}>{t.title}</span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold tracking-tight uppercase ${
                        t.priority === 'high' ? 'text-rose-600 bg-rose-50' : 
                        t.priority === 'medium' ? 'text-amber-600 bg-amber-50' : 'text-blue-600 bg-blue-50'
                      }`}>
                        <Flag size={10} />
                        {t.priority}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: project?.color }} />
                        <span className="text-xs font-medium text-slate-600">{project?.name || 'Genel'}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center text-[8px] font-bold text-primary-700">
                          {assignee?.avatar || '?'}
                        </div>
                        <span className="text-xs text-slate-600">{assignee?.name}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Calendar size={12} />
                        <span className="text-[10px] font-bold">{new Date(t.dueDate).toLocaleDateString('tr-TR')}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`badge uppercase text-[9px] ${
                        t.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                        t.status === 'in-progress' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {t.status === 'completed' ? 'Bitti' : t.status === 'in-progress' ? 'Devam' : 'Bekliyor'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button className="p-1.5 text-slate-400 hover:text-slate-900 rounded-lg">
                        <MoreVertical size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredTasks.length === 0 && (
            <div className="p-20 text-center">
              <CheckSquare size={48} className="mx-auto text-slate-200 mb-4" />
              <p className="text-slate-500 font-medium text-sm">Görev bulunamadı.</p>
            </div>
          )}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Yeni Görev Ekle">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Görev Başlığı</label>
            <input className="input" placeholder="Örn: Raporu tamamla" required value={title} onChange={e => setTitle(e.target.value)} />
          </div>
          <div>
            <label className="label">Proje</label>
            <select className="input" required value={projectId} onChange={e => setProjectId(e.target.value)}>
              <option value="">Seçiniz...</option>
              {projects.map((p: Project) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Öncelik</label>
              <select className="input" value={priority} onChange={e => setPriority(e.target.value as any)}>
                <option value="low">Düşük</option>
                <option value="medium">Orta</option>
                <option value="high">Yüksek</option>
              </select>
            </div>
            <div>
              <label className="label">Atanan</label>
              <select className="input" required value={assigneeId} onChange={e => setAssigneeId(e.target.value)}>
                <option value="">Seçiniz...</option>
                {members.map((m: TeamMember) => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="label">Bitiş Tarihi</label>
            <input type="date" className="input" required value={dueDate} onChange={e => setDueDate(e.target.value)} />
          </div>
          <div className="pt-4 flex gap-3">
            <button type="button" className="btn-secondary flex-1 justify-center" onClick={() => setIsModalOpen(false)}>İptal</button>
            <button type="submit" className="btn-primary flex-1 justify-center">Ekle</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
