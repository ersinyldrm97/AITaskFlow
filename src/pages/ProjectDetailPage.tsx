import { useParams, Link, useNavigate } from 'react-router-dom';
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
  AlertCircle
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
  const { tasks, addTask, updateTask } = useTaskStore();
  const { members } = useTeamStore();
  const { notify } = useNotificationStore();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [newTaskAssignee, setNewTaskAssignee] = useState('');
  const [newTaskDue, setNewTaskDue] = useState('');

  if (!project) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center p-20 space-y-6"
      >
        <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center shadow-inner">
          <AlertCircle size={48} />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Proje Bulunamadı</h2>
          <p className="text-slate-500 font-medium mt-2">Aradığınız proje silinmiş veya taşınmış olabilir.</p>
        </div>
        <Button onClick={() => navigate('/projects')}>Projelere Dön</Button>
      </motion.div>
    );
  }

  const projectTasks = tasks.filter((t: Task) => t.projectId === project.id);
  const columns = [
    { id: 'todo', title: 'Yapılacaklar', bg: 'bg-slate-100/50', dot: 'bg-slate-400' },
    { id: 'in-progress', title: 'Devam Ediyor', bg: 'bg-indigo-50/50', dot: 'bg-indigo-500' },
    { id: 'completed', title: 'Tamamlandı', bg: 'bg-emerald-50/50', dot: 'bg-emerald-500' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTask({
      title: newTaskTitle,
      description: '',
      status: 'todo',
      priority: newTaskPriority,
      projectId: project.id,
      assigneeId: newTaskAssignee || members[0]?.id || '',
      dueDate: newTaskDue || new Date().toISOString().split('T')[0],
    });
    notify('Görev başarıyla eklendi');
    setNewTaskTitle('');
    setIsModalOpen(false);
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
            </div>
            <div className="flex items-center gap-6 mt-2 text-xs text-slate-500 font-bold uppercase tracking-wider">
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-primary-500" />
                {new Date(project.endDate).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
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
                        <button className="p-1 text-slate-300 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreVertical size={14} />
                        </button>
                      </div>

                      <h4 className="text-[15px] font-black text-slate-900 mb-6 leading-tight group-hover:text-primary-600 transition-colors">{task.title}</h4>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                        <div className="flex items-center gap-2 text-slate-400 font-bold">
                          <Clock size={12} />
                          <span className="text-[10px] tracking-tight">{new Date(task.dueDate).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}</span>
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

      {/* New Task Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Yeni Görev Ekle">
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
            <Button variant="outline" type="button" className="flex-1 py-4 h-auto" onClick={() => setIsModalOpen(false)}>Vazgeç</Button>
            <Button type="submit" className="flex-1 py-4 h-auto shadow-primary-600/30">Görevi Oluştur</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
