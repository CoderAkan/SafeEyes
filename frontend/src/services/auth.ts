import api from './api';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: {
    id: string;
    username: string;
    email: string;
    role: string;
  };
}

export const authService = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const { data } = await api.post('/auth/login', payload);
    localStorage.setItem('safeeyes_token', data.access_token);
    localStorage.setItem('safeeyes_user', JSON.stringify(data.user));
    return data;
  },

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const { data } = await api.post('/auth/register', payload);
    localStorage.setItem('safeeyes_token', data.access_token);
    localStorage.setItem('safeeyes_user', JSON.stringify(data.user));
    return data;
  },

  async getCurrentUser() {
    const { data } = await api.get('/auth/me');
    return data;
  },

  logout() {
    localStorage.removeItem('safeeyes_token');
    localStorage.removeItem('safeeyes_user');
  },

  getToken(): string | null {
    return localStorage.getItem('safeeyes_token');
  },

  getStoredUser() {
    const user = localStorage.getItem('safeeyes_user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('safeeyes_token');
  },
};
