import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import ToastContainer from '../ui/ToastContainer';
import PageTransition from './PageTransition';
import { AnimatePresence } from 'framer-motion';
import { useProjectStore } from '../../store/projectStore';
import { useTaskStore } from '../../store/taskStore';
import { useTeamStore } from '../../store/teamStore';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/projects': 'Projeler',
  '/tasks': 'Görevler',
  '/team': 'Ekip',
  '/settings': 'Ayarlar',
};

export default function AppLayout() {
  const { pathname } = useLocation();
  const { fetchProjects } = useProjectStore();
  const { fetchTasks } = useTaskStore();
  const { fetchMembers } = useTeamStore();
  
  useEffect(() => {
    fetchProjects();
    fetchTasks();
    fetchMembers();
  }, [fetchProjects, fetchTasks, fetchMembers]);
  
  const title = pageTitles[pathname] || 
    (pathname.startsWith('/projects/') ? 'Proje Detayı' : 'TaskFlow');

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <Header title={title} />
      <main className="ml-[260px] pt-16 min-h-screen">
        <div className="p-6">
          <AnimatePresence mode="wait">
            <PageTransition key={location.pathname}>
              <Outlet />
            </PageTransition>
          </AnimatePresence>
        </div>
      </main>
      <ToastContainer />
    </div>
  );
}
