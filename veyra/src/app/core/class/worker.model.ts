export interface Worker {
  id: string | number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  lastAccess?: string;
}