import { api } from './api';

export const chatService = {
  getConversations: async () => {
    const response = await api.get('/chat/conversations');
    return response.data;
  },
  
  startOrGetConversation: async (vehicleId: string, sellerId: string) => {
    const response = await api.post('/chat/conversations', { vehicleId, sellerId });
    return response.data;
  },
  
  getMessages: async (conversationId: string) => {
    const response = await api.get(`/chat/conversations/${conversationId}/messages`);
    return response.data;
  },
  
  sendMessage: async (conversationId: string, text: string) => {
    const response = await api.post(`/chat/conversations/${conversationId}/messages`, { text });
    return response.data;
  }
};
