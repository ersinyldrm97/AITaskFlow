import { useEffect } from 'react';
import {
  FolderKanban,
  CheckSquare,
  Users,
  Clock,
  ArrowUpRight,
  Plus,
  MoreVertical,
  ChevronRight,
  Zap,
  TrendingUp,
  Target
} from 'lucide-react';
import { useProjectStore } from '../store/projectStore';
import { useTaskStore } from '../store/taskStore';
import { useTeamStore } from '../store/teamStore';
import { useAuthStore } from '../store/authStore';
import { Link } from 'react-router-dom';
import type { Project, Task, TeamMember } from '../types';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';

export default function DashboardPage() {
  const { projects, fetchProjects } = useProjectStore();
  const { tasks, fetchTasks } = useTaskStore();
  const { members, fetchMembers } = useTeamStore();
  const { currentUser } = useAuthStore();

  useEffect(() => {
    fetchProjects();
    fetchTasks();
    fetchMembers();
  }, [fetchProjects, fetchTasks, fetchMembers]);


  const firstName = currentUser?.name?.split(' ')[0] || 'Kullanıcı';

  const stats = [
    { 
      label: 'Toplam Proje', 
      value: projects.length, 
      icon: FolderKanban, 
      color: 'text-indigo-600', 
      bg: 'bg-indigo-50/50', 
      trend: `${projects.filter(p => p.status === 'active').length} aktif` 
    },
    { 
      label: 'Aktif Görevler', 
      value: tasks.filter((t: Task) => t.status !== 'completed').length, 
      icon: Target, 
      color: 'text-violet-600', 
      bg: 'bg-violet-50/50', 
      trend: `${tasks.filter((t: Task) => t.status === 'in-progress').length} devam ediyor` 
    },
    { 
      label: 'Ekip Üyeleri', 
      value: members.length, 
      icon: Users, 
      color: 'text-emerald-600', 
      bg: 'bg-emerald-50/50', 
      trend: `${members.length > 0 ? 'Aktif Ekip' : 'Üye Yok'}` 
    },
    { 
      label: 'Kritik Görevler', 
      value: tasks.filter((t: Task) => t.priority === 'high' && t.status !== 'completed').length, 
      icon: TrendingUp, 
      color: 'text-rose-600', 
      bg: 'bg-rose-50/50', 
      trend: tasks.some((t: Task) => t.priority === 'high' && t.status !== 'completed') ? 'Acil Müdahale' : 'Sorun Yok' 
    },
  ];

  const activeProjects = projects.filter((p: Project) => p.status === 'active').slice(0, 4);
  const upcomingTasks = tasks
    .filter((t: Task) => t.status !== 'completed' && t.dueDate)
    .sort((a, b) => {
      const dateA = new Date(a.dueDate).getTime();
      const dateB = new Date(b.dueDate).getTime();
      if (isNaN(dateA)) return 1;
      if (isNaN(dateB)) return -1;
      return dateA - dateB;
    })
    .slice(0, 5);

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            İyi işler, {firstName}! <span className="animate-wave origin-bottom-right inline-block">👋</span>
            {currentUser?.plan === 'pro' && (
              <motion.span
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-yellow-400 to-amber-600 text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-yellow-500/20"
              >
                <Zap size={10} className="fill-white" />
                PRO
              </motion.span>
            )}
          </h2>
          <p className="text-slate-500 font-medium mt-1">İşte bugün neler olduğuna dair bir özet.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Link to="/projects" className="group btn-primary px-6 py-3 rounded-2xl bg-gradient-to-r from-primary-600 to-indigo-600 shadow-xl shadow-primary-600/20 hover:shadow-primary-600/40 transition-all border-0 ring-1 ring-white/20">
            <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
            Yeni Proje Başlat
          </Link>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="premium-card p-6 relative overflow-hidden group"
          >
            {/* Background SVG pattern */}
            <div className="absolute top-0 right-0 -mr-4 -mt-4 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity pointer-events-none">
              <s.icon size={120} />
            </div>

            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className={`p-3 rounded-2xl ${s.bg} ${s.color} ring-4 ring-white shadow-sm shadow-black/5`}>
                <s.icon size={22} />
              </div>
              <div className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-full ${s.bg} ${s.color}`}>
                {s.trend}
              </div>
            </div>

            <div className="relative z-10">
              <div className="text-3xl font-black text-slate-900 leading-none">{s.value}</div>
              <div className="text-sm font-semibold text-slate-500 mt-2">{s.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Projects */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Aktif Projeler</h3>
            <Link to="/projects" className="text-sm font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1 group">
              Tümünü Gör <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {activeProjects.map((p: Project, i: number) => {
              const projectTasks = tasks.filter((t: Task) => t.projectId === p.id);
              const completedTasks = projectTasks.filter((t: Task) => t.status === 'completed');
              const progress = projectTasks.length > 0 ? (completedTasks.length / projectTasks.length) * 100 : 0;

              return (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + (i * 0.1) }}
                >
                  <Link to={`/projects/${p.id}`} className="premium-card p-6 group block h-full glass relative overflow-hidden hover:bg-white/90">
                    <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: p.color }} />

                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-xl font-black shadow-lg" style={{ backgroundColor: p.color }}>
                        {p.name.slice(0, 1)}
                      </div>
                      <div className="bg-slate-100/80 px-2 py-1 rounded-lg text-[10px] font-black uppercase text-slate-500 tracking-widest">
                        {p.status}
                      </div>
                    </div>

                    <h4 className="text-lg font-black text-slate-900 group-hover:text-primary-600 transition-colors mb-2 truncate">{p.name}</h4>
                    <p className="text-sm text-slate-500 mb-6 line-clamp-2 leading-relaxed font-medium">{p.description}</p>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider">
                        <span className="text-slate-400">İlerleme</span>
                        <span className="text-indigo-600">%{Math.round(progress)}</span>
                      </div>
                      <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 shadow-inner">
                        <motion.div
                          className="h-full rounded-full transition-all duration-1000 shadow-sm"
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          style={{ backgroundColor: p.color }}
                        />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Deadlines & Quick Info */}
        <div className="space-y-8">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Yaklaşan Görevler</h3>
              <Link to="/tasks" className="text-sm font-bold text-primary-600 hover:text-primary-700">Tümü</Link>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="premium-card divide-y divide-slate-50 overflow-hidden glass"
            >
              {upcomingTasks.map((t: Task, i: number) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + (i * 0.05) }}
                  className="p-4 hover:bg-primary-50/30 transition-colors group cursor-default"
                >
                  <div className="flex items-center gap-4">
                    <div className={`h-10 w-1 rounded-full flex-shrink-0 ${t.priority === 'high' ? 'bg-rose-500' :
                      t.priority === 'medium' ? 'bg-amber-500' : 'bg-indigo-500'
                      }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate group-hover:text-primary-600 transition-colors tracking-tight">{t.title}</p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
                          <Clock size={12} />
                          {t.dueDate && !isNaN(new Date(t.dueDate).getTime()) 
                            ? new Date(t.dueDate).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' }) 
                            : 'Tarih yok'}
                        </div>
                        <span className={`text-[10px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded ${t.priority === 'high' ? 'text-rose-600 bg-rose-50' :
                          t.priority === 'medium' ? 'text-amber-600 bg-amber-50' : 'text-indigo-600 bg-indigo-50'
                          }`}>
                          {t.priority}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
              {upcomingTasks.length === 0 && (
                <div className="p-12 text-center">
                  <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckSquare size={20} className="text-slate-300" />
                  </div>
                  <p className="text-sm font-bold text-slate-400 italic">Harika, tüm işler bitti!</p>
                </div>
              )}
            </motion.div>
          </div>

          {/* Pro Promotion - Only visible to Free users */}
          {currentUser?.plan === 'free' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="premium-card p-6 bg-slate-900 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-slate-900 text-white border-0 shadow-2xl shadow-indigo-500/10"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-lg flex items-center justify-center shadow-lg shadow-yellow-500/20">
                  <Zap size={16} className="text-white fill-white" />
                </div>
                <h4 className="text-base font-black tracking-tight">TaskFlow <span className="text-yellow-400">Pro</span></h4>
              </div>
              <p className="text-sm text-slate-400 mb-6 leading-relaxed font-medium">Sınırsız proje, gelişmiş analitiği ve ekip işbirliğini şimdi aktifleştirin.</p>
              <Link to="/pricing" className="block w-full">
                <button className="w-full py-4 bg-white text-slate-900 hover:bg-slate-50 border-0 rounded-2xl shadow-xl shadow-black/10 font-black text-xs uppercase tracking-widest active:scale-95 transition-all">
                  Yükseltmeye Başla
                </button>
              </Link>
            </motion.div>
          )}

          {/* Pro User Badge in Aside (Optional: Shows status for Pro users instead of promotion) */}
          {currentUser?.plan === 'pro' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="premium-card p-6 bg-gradient-to-br from-indigo-600 to-violet-700 text-white border-0 relative overflow-hidden group shadow-2xl shadow-indigo-600/20"
            >
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-colors" />
              <div className="relative z-10 flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30">
                  <Zap size={24} className="text-yellow-300 fill-yellow-300 animate-pulse" />
                </div>
                <div>
                  <h4 className="font-black text-white tracking-tight uppercase text-xs tracking-[0.2em]">Aktif Abonelik</h4>
                  <p className="text-indigo-100 text-lg font-black tracking-tighter">TaskFlow Pro</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
