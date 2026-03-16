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
import { useAuthStore } from '../../store/authStore';
import { Navigate } from 'react-router-dom';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/projects': 'Projeler',
  '/tasks': 'Görevler',
  '/team': 'Ekip',
  '/settings': 'Ayarlar',
};
export default function AppLayout() {
  const { pathname } = useLocation();
  const { hasLoaded: projectsLoaded, isLoading: projectsLoading, fetchProjects } = useProjectStore();
  const { hasLoaded: tasksLoaded, isLoading: tasksLoading, fetchTasks } = useTaskStore();
  const { hasLoaded: membersLoaded, isLoading: membersLoading, fetchMembers } = useTeamStore();
  const { currentWorkspace } = useAuthStore();
  
  useEffect(() => {
    if (currentWorkspace) {
      if (!projectsLoaded && !projectsLoading) fetchProjects();
      if (!tasksLoaded && !tasksLoading) fetchTasks();
      if (!membersLoaded && !membersLoading) fetchMembers();
    }
  }, [projectsLoaded, tasksLoaded, membersLoaded, projectsLoading, tasksLoading, membersLoading, currentWorkspace]);

  if (!currentWorkspace && pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }
  
  const title = pageTitles[pathname] || 
    (pathname.startsWith('/projects/') ? 'Proje Detayı' : 'TaskFlow');

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <Header title={title} />
      <main className="ml-[260px] pt-16 min-h-screen">
        <div className="p-6">
          <AnimatePresence mode="wait">
            <PageTransition key={pathname}>
              <Outlet />
            </PageTransition>
          </AnimatePresence>
        </div>
      </main>
      <ToastContainer />
    </div>
  );
}
