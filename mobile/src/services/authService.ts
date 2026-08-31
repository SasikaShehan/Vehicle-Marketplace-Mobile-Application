import { api } from './api';
import { AuthResponse } from '../types/auth';

export const authService = {
  login: async (data: any): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
  },
  register: async (data: any): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },
  logout: async (refreshToken: string) => {
    await api.post('/auth/logout', { refreshToken });
  }
};
