export interface Conversation {
  id: string;
  vehicleId: string;
  buyerId: string;
  sellerId: string;
  lastMessage?: string;
  lastMessageAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  isRead: boolean;
  createdAt: Date;
}

export enum NotificationType {
  LISTING_APPROVED = 'ListingApproved',
  LISTING_REJECTED = 'ListingRejected',
  NEW_INQUIRY = 'NewInquiry',
  NEW_MESSAGE = 'NewMessage',
  FAVORITE_ADDED = 'FavoriteAdded'
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  isRead: boolean;
  data?: any;
  createdAt: Date;
}
