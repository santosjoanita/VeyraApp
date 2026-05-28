export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  notes?: string;
  isActive: boolean;
  ActiveProjects?: number;
  createdAt: string;
}