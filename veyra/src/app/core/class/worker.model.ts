export interface Worker {
  id: string;
  email: string;
  name: string;
  role: string;

  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;

  status?: string;
  lastAccess?: string;
}
