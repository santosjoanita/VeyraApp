export interface User {
  id: string;
  email: string;
  role: string;
  name?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}
