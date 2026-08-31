import { api } from './api';

export const analyticsService = {
  getSellerDashboard: async () => {
    const response = await api.get('/analytics/seller/dashboard');
    return response.data;
  }
};

export const savedSearchService = {
  saveSearch: async (name: string, criteria: any, notificationsEnabled: boolean = true) => {
    const response = await api.post('/saved-searches', { name, criteria, notificationsEnabled });
    return response.data;
  },
  
  getSavedSearches: async () => {
    const response = await api.get('/saved-searches');
    return response.data;
  },
  
  deleteSavedSearch: async (id: string) => {
    const response = await api.delete(`/saved-searches/${id}`);
    return response.data;
  }
};
