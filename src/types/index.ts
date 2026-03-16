export interface Workspace {
  id: string;
  name: string;
  slug: string;
  ownerId: string;
  createdAt: string;
}

export interface WorkspaceMember {
  workspaceId: string;
  userId: string;
  role: 'admin' | 'member';
  joinedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  avatar?: string;
  role: string;
  plan?: 'free' | 'pro';
  subscriptionStatus?: string;
  createdAt: string;
  workspaceId?: string; // Mevcut aktif workspace
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'on-hold';
  startDate: string;
  endDate: string;
  teamId: string;
  workspaceId: string;
  color: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  projectId: string;
  workspaceId: string;
  assigneeId: string;
  dueDate: string;
  createdAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  workspaceId: string;
  avatar?: string;
  joinedAt: string;
}
