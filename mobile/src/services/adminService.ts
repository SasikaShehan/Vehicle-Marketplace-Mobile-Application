import { api } from './api';

export const adminService = {
  getPlatformAnalytics: async () => {
    const response = await api.get('/admin/analytics');
    return response.data;
  },

  getPendingVehicles: async () => {
    const response = await api.get('/admin/vehicles/pending');
    return response.data;
  },

  moderateVehicle: async (id: string, action: 'Approve' | 'Reject', reason?: string) => {
    const response = await api.patch(`/admin/vehicles/${id}/moderate`, { action, reason });
    return response.data;
  }
};
