export interface Project {
  id: string;
  clientId: string;
  name: string;
  description?: string;
  status: 'active' | 'completed' | 'paused';
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}
