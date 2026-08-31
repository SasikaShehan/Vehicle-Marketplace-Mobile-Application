import { ConversationModel } from '../database/models/ConversationModel';
import { MessageModel } from '../database/models/MessageModel';

export class ChatRepository {
  async getOrCreateConversation(vehicleId: string, buyerId: string, sellerId: string) {
    let conversation = await ConversationModel.findOne({ vehicleId, buyerId, sellerId });
    if (!conversation) {
      conversation = await ConversationModel.create({ vehicleId, buyerId, sellerId });
    }
    return conversation;
  }

  async getUserConversations(userId: string) {
    return await ConversationModel.find({
      $or: [{ buyerId: userId }, { sellerId: userId }]
    })
    .populate('buyerId', 'fullName')
    .populate('sellerId', 'fullName')
    .populate('vehicleId', 'make model year price images')
    .sort({ lastMessageAt: -1 });
  }

  async getMessages(conversationId: string) {
    return await MessageModel.find({ conversationId }).sort({ createdAt: 1 });
  }

  async sendMessage(conversationId: string, senderId: string, text: string) {
    const message = await MessageModel.create({ conversationId, senderId, text });
    await ConversationModel.findByIdAndUpdate(conversationId, {
      lastMessage: text,
      lastMessageAt: new Date()
    });
    return message;
  }

  async markMessagesAsRead(conversationId: string, userId: string) {
    await MessageModel.updateMany(
      { conversationId, senderId: { $ne: userId }, isRead: false },
      { $set: { isRead: true } }
    );
  }
}
