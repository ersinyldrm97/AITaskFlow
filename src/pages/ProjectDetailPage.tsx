import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useProjectStore } from '../store/projectStore';
import { useTaskStore } from '../store/taskStore';
import { useTeamStore } from '../store/teamStore';
import { 
  ChevronLeft, 
  Calendar, 
  CheckSquare, 
  Plus, 
  Clock, 
  MoreVertical,
  AlertCircle,
  Trash2,
  Edit2
} from 'lucide-react';
import { useState } from 'react';
import Modal from '../components/ui/Modal';
import { useNotificationStore } from '../store/notificationStore';
import type { Project, Task, TeamMember } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/ui/Button';

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const project = useProjectStore(state => state.projects.find((p: Project) => p.id === id));
  const { tasks, addTask, updateTask, deleteTask, fetchTasks, hasLoaded: tasksLoaded, isLoading: tasksLoading } = useTaskStore();
  const { members, fetchMembers, hasLoaded: membersLoaded, isLoading: membersLoading } = useTeamStore();
  const { fetchProjects, updateProject, hasLoaded: projectsLoaded, isLoading: projectsLoading } = useProjectStore();
  const { notify } = useNotificationStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [newTaskAssignee, setNewTaskAssignee] = useState('');
  const [newTaskDue, setNewTaskDue] = useState('');

  // Project Edit Modal State
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editProjectName, setEditProjectName] = useState('');
  const [editProjectDesc, setEditProjectDesc] = useState('');
  const [editProjectEnd, setEditProjectEnd] = useState('');

  // Verilerin yüklenip yüklenmediğini kontrol et
  const isDataLoading = !projectsLoaded || projectsLoading || !tasksLoaded || tasksLoading || !membersLoaded || membersLoading;

  // Sadece bu sayfa özelinde eksik veri varsa tamamla
  useEffect(() => {
    if (!isDataLoading && !project && id) {
      // Eğer veriler yüklendiği halde proje bulunamadıysa, son bir kez daha listeyi güncellemeyi dene
      fetchProjects();
    }
  }, [id, project, isDataLoading, fetchProjects]);

  const projectTasks = tasks.filter((t: Task) => t.projectId === project?.id);
  const columns = [
    { id: 'todo', title: 'Yapılacaklar', bg: 'bg-slate-100/50', dot: 'bg-slate-400' },
    { id: 'in-progress', title: 'Devam Ediyor', bg: 'bg-indigo-50/50', dot: 'bg-indigo-500' },
    { id: 'completed', title: 'Tamamlandı', bg: 'bg-emerald-50/50', dot: 'bg-emerald-500' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!project) return;
    
    if (editingTask) {
      await updateTask(editingTask.id, {
        title: newTaskTitle,
        priority: newTaskPriority,
        assigneeId: newTaskAssignee,
        dueDate: newTaskDue,
      });
      notify('Görev güncellendi');
    } else {
      await addTask({
        title: newTaskTitle,
        description: '',
        status: 'todo',
        priority: newTaskPriority,
        projectId: project.id,
        assigneeId: newTaskAssignee || members[0]?.id || '',
        dueDate: newTaskDue || new Date().toISOString().split('T')[0],
      });
      notify('Görev başarıyla eklendi');
    }
    
    setEditingTask(null);
    setNewTaskTitle('');
    setNewTaskDue('');
    setIsModalOpen(false);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setNewTaskTitle(task.title);
    setNewTaskPriority(task.priority);
    setNewTaskAssignee(task.assigneeId || '');
    setNewTaskDue(task.dueDate);
    setIsModalOpen(true);
  };

  const handleDeleteTask = async (taskId: string) => {
    if (confirm('Bu görevi silmek istediğinize emin misiniz?')) {
      await deleteTask(taskId);
      notify('Görev silindi', 'error');
    }
  };

  const handleProjectEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project) return;
    await updateProject(project.id, {
      name: editProjectName,
      description: editProjectDesc,
      endDate: editProjectEnd
    });
    notify('Proje bilgileri güncellendi');
    setIsProjectModalOpen(false);
  };

  const moveTask = (taskId: string, newStatus: 'todo' | 'in-progress' | 'completed') => {
    updateTask(taskId, { status: newStatus });
    notify(`Durum güncellendi: ${newStatus === 'completed' ? 'Tamamlandı' : newStatus === 'in-progress' ? 'Devam Ediyor' : 'Yapılacak'}`);
  };

  const [activeDragCol, setActiveDragCol] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDragOver = (e: React.DragEvent, colId: string) => {
    e.preventDefault();
    setActiveDragCol(colId);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    setActiveDragCol(null);
  };

  const handleDrop = (e: React.DragEvent, colId: 'todo' | 'in-progress' | 'completed') => {
    e.preventDefault();
    setActiveDragCol(null);
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
      const task = tasks.find((t: Task) => t.id === taskId);
      if (task && task.status !== colId) {
        moveTask(taskId, colId);
      }
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {isDataLoading ? (
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin"></div>
            <p className="text-slate-400 text-sm font-black uppercase tracking-widest animate-pulse">Veriler Hazırlanıyor...</p>
          </div>
        </div>
      ) : !project ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center p-20 space-y-6"
        >
          <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center shadow-inner">
            <AlertCircle size={48} />
          </div>
          <div className="text-center max-w-md">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Proje Bilgileri Alınamadı</h2>
            <p className="text-slate-500 font-medium mt-2">
              İstediğiniz projeye şu an ulaşılamıyor. <code className="bg-slate-100 px-1 py-0.5 rounded text-rose-500 font-bold">.env</code> dosyasındaki anahtarın doğruluğundan eminseniz, proje silinmiş olabilir veya erişim yetkiniz olmayabilir.
            </p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => fetchProjects()}>Tekrar Dene</Button>
            <Button onClick={() => navigate('/projects')}>Projelere Dön</Button>
          </div>
        </motion.div>
      ) : (
        <>
      {/* Detail Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/projects')} 
            className="p-3 bg-white border border-slate-200 rounded-2xl hover:border-primary-600 hover:text-primary-600 transition-all shadow-sm"
          >
            <ChevronLeft size={20} />
          </motion.button>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">{project.name}</h2>
              <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                project.status === 'active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 
                project.status === 'on-hold' ? 'bg-amber-50 text-amber-700 border border-amber-100' : 'bg-slate-100 text-slate-600 border border-slate-200'
              }`}>
                {project.status === 'active' ? 'Aktif' : project.status === 'on-hold' ? 'Askıda' : 'Tamamlandı'}
              </span>
              <button 
                onClick={() => {
                  setEditProjectName(project.name);
                  setEditProjectDesc(project.description);
                  setEditProjectEnd(project.endDate);
                  setIsProjectModalOpen(true);
                }}
                className="p-1.5 text-slate-400 hover:text-primary-600 transition-colors"
                title="Projeyi Düzenle"
              >
                <MoreVertical size={16} />
              </button>
            </div>
            <div className="flex items-center gap-6 mt-2 text-xs text-slate-500 font-bold uppercase tracking-wider">
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-primary-500" />
                {project.endDate && !isNaN(new Date(project.endDate).getTime()) 
                  ? new Date(project.endDate).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }) 
                  : 'Tarih belirtilmedi'}
              </div>
              <div className="flex items-center gap-2">
                <CheckSquare size={14} className="text-primary-500" />
                {projectTasks.filter((t: Task) => t.status === 'completed').length}/{projectTasks.length} Tamamlandı
              </div>
            </div>
          </div>
        </div>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <Button onClick={() => setIsModalOpen(true)} className="gap-2 px-6 shadow-primary-600/30">
            <Plus size={20} />
            Yeni Görev Ekle
          </Button>
        </motion.div>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-6 pb-6 overflow-x-auto min-h-[calc(100vh-280px)] scrollbar-hide">
        {columns.map((col, colIdx) => (
          <motion.div 
            key={col.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: colIdx * 0.1 }}
            className={`flex-1 min-w-[320px] max-w-[400px] flex flex-col gap-5 p-2 rounded-3xl transition-colors ${activeDragCol === col.id ? 'bg-primary-50/50 ring-2 ring-primary-500/50 ring-inset' : ''}`}
            onDragOver={(e: any) => handleDragOver(e, col.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e: any) => handleDrop(e, col.id as any)}
          >
            <div className={`flex items-center justify-between p-4 rounded-2xl glass ${col.bg} border-0 shadow-sm`}>
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${col.dot}`} />
                <span className="font-black text-sm text-slate-900 tracking-tight uppercase tracking-widest">{col.title}</span>
                <span className="bg-white/80 text-slate-700 px-2.5 py-1 rounded-lg text-[10px] font-black shadow-sm ring-1 ring-black/5">
                  {projectTasks.filter((t: Task) => t.status === col.id).length}
                </span>
              </div>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-primary-600 hover:bg-white rounded-lg transition-all"
              >
                <Plus size={18} />
              </button>
            </div>

            <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-1">
              <AnimatePresence mode="popLayout">
                {projectTasks.filter((t: Task) => t.status === col.id).map((task: Task, taskIdx: number) => {
                  const assignee = members.find((m: TeamMember) => m.id === task.assigneeId);
                  return (
                    <motion.div 
                      key={task.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9, y: 10 }}
                      transition={{ type: "spring", damping: 25, stiffness: 200 }}
                      draggable
                      onDragStart={(e: any) => handleDragStart(e, task.id)}
                      className="premium-card p-5 group cursor-grab active:cursor-grabbing glass hover:bg-white focus-within:ring-2 focus-within:ring-primary-600"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-[0.1em] ${
                          task.priority === 'high' ? 'bg-rose-50 text-rose-700 border border-rose-100' : 
                          task.priority === 'medium' ? 'bg-amber-50 text-amber-700 border border-amber-100' : 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                        }`}>
                          {task.priority === 'high' ? 'Kritik' : task.priority === 'medium' ? 'Orta' : 'Düşük'}
                        </span>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleEditTask(task)}
                            className="p-1 text-slate-400 hover:text-primary-600"
                            title="Düzenle"
                          >
                            <Calendar size={14} />
                          </button>
                          <button 
                            onClick={() => handleDeleteTask(task.id)}
                            className="p-1 text-slate-400 hover:text-rose-500"
                            title="Sil"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      <h4 className="text-[15px] font-black text-slate-900 mb-6 leading-tight group-hover:text-primary-600 transition-colors">{task.title}</h4>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                        <div className="flex items-center gap-2 text-slate-400 font-bold">
                          <Clock size={12} />
                          <span className="text-[10px] tracking-tight">
                            {task.dueDate && !isNaN(new Date(task.dueDate).getTime()) 
                              ? new Date(task.dueDate).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' }) 
                              : 'Tarih yok'}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {col.id === 'todo' && (
                            <button 
                              onClick={() => moveTask(task.id, 'in-progress')}
                              className="p-1.5 bg-slate-50 text-slate-400 hover:bg-indigo-600 hover:text-white rounded-lg transition-all shadow-sm"
                              title="Başlat"
                            >
                              <ChevronLeft className="rotate-180" size={14} />
                            </button>
                          )}
                          {col.id === 'in-progress' && (
                            <button 
                              onClick={() => moveTask(task.id, 'completed')}
                              className="p-1.5 bg-indigo-50 text-indigo-600 hover:bg-emerald-600 hover:text-white rounded-lg transition-all shadow-sm"
                              title="Tamamla"
                            >
                              <ChevronLeft className="rotate-180" size={14} />
                            </button>
                          )}
                          
                          <div 
                            className="w-7 h-7 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center text-[10px] font-black text-slate-600 border-2 border-white shadow-sm ring-1 ring-black/5" 
                            title={assignee?.name}
                          >
                            {assignee?.avatar || '?'}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              
              {projectTasks.filter((t: Task) => t.status === col.id).length === 0 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-2 border-dashed border-slate-200/50 rounded-2xl p-8 text-center"
                >
                  <p className="text-[11px] font-bold text-slate-300 uppercase tracking-widest italic">Görev Bulunmuyor</p>
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* New/Edit Task Modal */}
      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingTask(null); }} title={editingTask ? "Görevi Düzenle" : "Yeni Görev Ekle"}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400">Görev Başlığı</label>
            <input 
              className="input h-12 text-base font-semibold" 
              placeholder="Örn: Login sayfasını tasarla" 
              required 
              value={newTaskTitle}
              onChange={e => setNewTaskTitle(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">Aciliyet</label>
              <select 
                className="input h-12 font-bold appearance-none bg-slate-50" 
                value={newTaskPriority}
                onChange={e => setNewTaskPriority(e.target.value as any)}
              >
                <option value="low">Düşük</option>
                <option value="medium">Orta</option>
                <option value="high">Yüksek (Kritik)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">Atanan Ekip Üyesi</label>
              <select 
                className="input h-12 font-bold appearance-none bg-slate-50" 
                value={newTaskAssignee}
                onChange={e => setNewTaskAssignee(e.target.value)}
                required
              >
                <option value="">Seçiniz...</option>
                {members.map((m: TeamMember) => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400">Hedef Tarih</label>
            <input 
              type="date" 
              className="input h-12 font-bold" 
              value={newTaskDue}
              onChange={e => setNewTaskDue(e.target.value)}
              required
            />
          </div>
          <div className="pt-6 flex gap-4">
            <Button variant="outline" type="button" className="flex-1 py-4 h-auto" onClick={() => { setIsModalOpen(false); setEditingTask(null); }}>Vazgeç</Button>
            <Button type="submit" className="flex-1 py-4 h-auto shadow-primary-600/30">
              {editingTask ? 'Güncelle' : 'Görevi Oluştur'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Project Edit Modal */}
      <Modal isOpen={isProjectModalOpen} onClose={() => setIsProjectModalOpen(false)} title="Projeyi Düzenle">
        <form onSubmit={handleProjectEditSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400">Proje Adı</label>
            <input 
              className="input h-12 text-base font-semibold" 
              value={editProjectName}
              onChange={e => setEditProjectName(e.target.value)}
              required 
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400">Açıklama</label>
            <textarea 
              className="input min-h-[100px] py-3 text-sm"
              value={editProjectDesc}
              onChange={e => setEditProjectDesc(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400">Bitiş Tarihi</label>
            <input 
              type="date" 
              className="input h-12" 
              value={editProjectEnd}
              onChange={e => setEditProjectEnd(e.target.value)}
              required 
            />
          </div>
          <div className="pt-6 flex gap-4">
            <Button variant="outline" type="button" className="flex-1 py-4 h-auto" onClick={() => setIsProjectModalOpen(false)}>Vazgeç</Button>
            <Button type="submit" className="flex-1 py-4 h-auto shadow-primary-600/30">Kaydet</Button>
          </div>
        </form>
      </Modal>
        </>
      )}
    </div>
  );
}
