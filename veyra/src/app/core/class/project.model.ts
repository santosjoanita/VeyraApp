export interface Project {
  id: string;
  name: string;
  clientId: string; 
  clientName: string; 
  status: 'active' | 'completed' | 'paused';
  startDate: string;
  endDate: string; 
  description?: string;
  createdAt: string;
  updatedAt: string;
  assignedTeam: { userId: string, name: string }[]; 
}