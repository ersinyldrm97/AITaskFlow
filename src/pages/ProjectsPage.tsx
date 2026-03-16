import { useState, useEffect } from 'react';
import { useProjectStore } from '../store/projectStore';
import { useTaskStore } from '../store/taskStore';
import { useTeamStore } from '../store/teamStore';
import { 
  Plus, 
  Search, 
  Filter, 
  FolderKanban, 
  CheckSquare, 
  Calendar, 
  ChevronRight,
  Trash2,
  Edit2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Modal from '../components/ui/Modal';
import { useNotificationStore } from '../store/notificationStore';
import type { Project, Task } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/ui/Button';

export default function ProjectsPage() {
  const { projects, addProject, updateProject, deleteProject, fetchProjects } = useProjectStore();
  const { tasks, fetchTasks } = useTaskStore();
  const { members, fetchMembers } = useTeamStore();
  const { notify } = useNotificationStore();

  useEffect(() => {
    fetchProjects();
    fetchTasks();
    fetchMembers();
  }, [fetchProjects, fetchTasks, fetchMembers]);

  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  
  // Form State
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newEnd, setNewEnd] = useState('');

  const filteredProjects = projects.filter((p: Project) => {
    const matchesFilter = filter === 'all' || p.status === filter;
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingProject) {
      await updateProject(editingProject.id, {
        name: newName,
        description: newDesc,
        endDate: newEnd,
      });
      notify('Proje başarıyla güncellendi');
    } else {
      await addProject({
        name: newName,
        description: newDesc,
        status: 'active',
        startDate: new Date().toISOString().split('T')[0],
        endDate: newEnd,
        teamId: 'team-1',
      });
      notify('Yeni proje başarıyla oluşturuldu');
    }

    setNewName('');
    setNewDesc('');
    setNewEnd('');
    setEditingProject(null);
    setIsModalOpen(false);
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setNewName(project.name);
    setNewDesc(project.description);
    setNewEnd(project.endDate);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
    setNewName('');
    setNewDesc('');
    setNewEnd('');
  };
  
  const handleDelete = (id: string, name: string) => {
    if (confirm(`"${name}" projesini silmek istediğinize emin misiniz?`)) {
      deleteProject(id);
      notify('Proje silindi', 'error');
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Projelerim</h2>
          <p className="text-slate-500 font-medium mt-1">Toplam {projects.length} projeniz bulunuyor.</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Button 
            onClick={() => {
              setEditingProject(null);
              setIsModalOpen(true);
            }} 
            className="gap-2"
          >
            <Plus size={20} />
            Yeni Proje Oluştur
          </Button>
        </motion.div>
      </div>

      {/* Filters & Search */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col md:flex-row gap-4 sticky top-4 z-20 backdrop-blur-md bg-white/50 p-2 rounded-2xl glass border-white/50 shadow-lg shadow-black/5"
      >
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4.5 h-4.5 group-focus-within:text-primary-600 transition-colors" />
          <input
            type="text"
            placeholder="Proje ara..."
            className="input pl-11 h-12 bg-white/80 border-slate-100 group-hover:border-slate-200 focus:bg-white transition-all rounded-xl"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
          {['all', 'active', 'on-hold', 'completed'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 py-2 rounded-xl text-sm font-black transition-all whitespace-nowrap capitalize border-0 ${
                filter === f 
                  ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/10 scale-105' 
                  : 'bg-white/80 text-slate-500 hover:text-slate-900 hover:bg-white'
              }`}
            >
              {f === 'all' ? 'Tümü' : f === 'on-hold' ? 'Askıda' : f === 'active' ? 'Aktif' : 'Tamamlandı'}
            </button>
          ))}
          <div className="h-8 w-px bg-slate-200 mx-2" />
          <button className="p-3 bg-white/80 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-white transition-all">
            <Filter size={18} />
          </button>
        </div>
      </motion.div>

      {/* Projects Grid */}
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        <AnimatePresence>
          {filteredProjects.map((p: Project, i: number) => {
            const projectTasks = tasks.filter((t: Task) => t.projectId === p.id);
            const completedCount = projectTasks.filter((t: Task) => t.status === 'completed').length;
            const progress = projectTasks.length > 0 ? (completedCount / projectTasks.length) * 100 : 0;

            return (
              <motion.div 
                key={p.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="premium-card group flex flex-col h-full glass">
                  <div className="p-7 flex-1">
                    <div className="flex items-start justify-between mb-6">
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black shadow-xl" style={{ backgroundColor: p.color, color: 'white' }}>
                        {p.name.charAt(0)}
                      </div>
                      <div className="flex items-center gap-1 opacity-100 group-focus-within:opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <button 
                          onClick={() => handleEdit(p)}
                          className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(p.id, p.name)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                    
                    <Link to={`/projects/${p.id}`} className="block mb-3">
                      <h3 className="text-xl font-black text-slate-900 group-hover:text-primary-600 transition-colors tracking-tight line-clamp-1">{p.name}</h3>
                    </Link>
                    <p className="text-sm text-slate-500 line-clamp-2 mb-8 leading-relaxed font-medium">{p.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <div className="bg-slate-50/80 rounded-2xl p-3 border border-slate-100 glass">
                        <div className="flex items-center gap-2 text-slate-400 mb-1">
                          <CheckSquare size={14} className="text-primary-500" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Görevler</span>
                        </div>
                        <div className="text-sm font-black text-slate-900">{completedCount}/{projectTasks.length}</div>
                      </div>
                      <div className="bg-slate-50/80 rounded-2xl p-3 border border-slate-100 glass">
                        <div className="flex items-center gap-2 text-slate-400 mb-1">
                          <Calendar size={14} className="text-primary-500" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Deadline</span>
                        </div>
                        <div className="text-sm font-black text-slate-900">{new Date(p.endDate).toLocaleDateString('tr-TR', { month: 'short', day: 'numeric' })}</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest">
                        <span className="text-slate-400">İlerleme</span>
                        <span className="text-primary-600">%{Math.round(progress)}</span>
                      </div>
                      <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 shadow-inner">
                        <motion.div 
                          className="h-full rounded-full transition-all shadow-sm"
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                          style={{ backgroundColor: p.color }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="px-7 py-5 bg-slate-50/50 border-t border-slate-100/50 flex items-center justify-between backdrop-blur-sm">
                    <div className="flex -space-x-3">
                      {members.slice(0, 3).map(m => (
                        <div key={m.id} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-black text-slate-500 shadow-sm overflow-hidden bg-gradient-to-br from-slate-200 to-slate-300">
                          {m.avatar || m.name.charAt(0)}
                        </div>
                      ))}
                      {members.length > 3 && (
                        <div className="w-8 h-8 rounded-full border-2 border-white bg-primary-50 flex items-center justify-center text-[10px] font-black text-primary-600 shadow-sm">
                          +{members.length - 3}
                        </div>
                      )}
                      {members.length === 0 && (
                        <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400 shadow-sm italic">
                          ?
                        </div>
                      )}
                    </div>
                    <Link 
                      to={`/projects/${p.id}`} 
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-900 hover:border-primary-600 hover:text-primary-600 transition-all shadow-sm group/btn"
                    >
                      Yönet
                      <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {filteredProjects.length === 0 && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="col-span-full premium-card p-16 flex flex-col items-center justify-center text-center space-y-6 glass relative overflow-hidden"
        >
          {/* Subtle background decoration */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary-500/10 rounded-full blur-[80px] pointer-events-none" />
          
          <div className="w-24 h-24 bg-gradient-to-br from-primary-50 to-indigo-50 rounded-[2rem] flex items-center justify-center text-primary-500 shadow-xl shadow-primary-500/10 mb-2 relative z-10 transition-transform hover:scale-110 duration-500">
            <FolderKanban size={48} strokeWidth={1.5} />
          </div>
          <div className="max-w-md mx-auto relative z-10">
            <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-3">Henüz Proje Yok</h3>
            <p className="text-slate-500 font-medium leading-relaxed">Yeni bir projeye başlamak için hemen bir çalışma alanı oluşturun. Görevleri ve ekibinizi kolayca yönetin.</p>
          </div>
          <div className="relative z-10 mt-4">
            <button 
              onClick={() => {
                setEditingProject(null);
                setIsModalOpen(true);
              }} 
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary-600 text-white rounded-2xl font-black tracking-widest uppercase text-xs shadow-xl shadow-primary-600/30 hover:bg-primary-700 hover:-translate-y-1 transition-all duration-300"
            >
              <Plus size={18} />
              İlk Projeni Oluştur
            </button>
          </div>
        </motion.div>
      )}

      {/* New Project Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        title={editingProject ? "Projeyi Düzenle" : "Yeni Proje Oluştur"}
      >
        <form onSubmit={handleSubmit} className="space-y-6 p-1">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400">Proje Adı</label>
            <input 
              className="input h-12 text-base font-semibold" 
              placeholder="Örn: E-ticaret Sitesi Yenileme" 
              required 
              value={newName}
              onChange={e => setNewName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400">Açıklama</label>
            <textarea 
              className="input min-h-[120px] py-4 text-sm font-medium leading-relaxed" 
              placeholder="Proje hedefleri ve kapsamı hakkında kısa bir bilgi..." 
              required
              value={newDesc}
              onChange={e => setNewDesc(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">Başlangıç</label>
              <input type="date" className="input h-12" defaultValue={new Date().toISOString().split('T')[0]} readOnly />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">Bitiş Tarihi</label>
              <input 
                type="date" 
                className="input h-12" 
                required
                value={newEnd}
                onChange={e => setNewEnd(e.target.value)}
              />
            </div>
          </div>
          <div className="pt-6 flex gap-4">
            <Button variant="outline" type="button" className="flex-1 py-4 h-auto" onClick={closeModal}>Vazgeç</Button>
            <Button type="submit" className="flex-1 py-4 h-auto shadow-primary-600/30">
              {editingProject ? 'Değişiklikleri Kaydet' : 'Oluştur ve Paylaş'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
