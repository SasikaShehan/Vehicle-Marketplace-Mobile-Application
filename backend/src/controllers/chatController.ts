import { Request, Response, NextFunction } from 'express';
import { ChatRepository } from '../repositories/ChatRepository';

const chatRepository = new ChatRepository();

export const chatController = {
  async getConversations(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.userId;
      const conversations = await chatRepository.getUserConversations(userId);
      res.json({ success: true, data: conversations, message: 'Conversations retrieved' });
    } catch (error) {
      next(error);
    }
  },

  async startOrGetConversation(req: Request, res: Response, next: NextFunction) {
    try {
      const buyerId = (req as any).user.userId;
      const { vehicleId, sellerId } = req.body;

      if (!vehicleId || !sellerId) {
        return res.status(400).json({ success: false, message: 'VehicleId and SellerId are required' });
      }

      const conversation = await chatRepository.getOrCreateConversation(vehicleId, buyerId, sellerId);
      res.json({ success: true, data: conversation, message: 'Conversation retrieved' });
    } catch (error) {
      next(error);
    }
  },

  async getMessages(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.userId;
      const conversationId = req.params.id as string;

      await chatRepository.markMessagesAsRead(conversationId, userId);
      const messages = await chatRepository.getMessages(conversationId);
      
      res.json({ success: true, data: messages, message: 'Messages retrieved' });
    } catch (error) {
      next(error);
    }
  },

  async sendMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const senderId = (req as any).user.userId;
      const conversationId = req.params.id as string;
      const { text } = req.body;

      if (!text) {
        return res.status(400).json({ success: false, message: 'Message text is required' });
      }

      const message = await chatRepository.sendMessage(conversationId, senderId, text);
      res.json({ success: true, data: message, message: 'Message sent' });
    } catch (error) {
      next(error);
    }
  }
};
