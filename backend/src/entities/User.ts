export enum UserRole {
  BUYER = 'Buyer',
  SELLER = 'Seller',
  ADMIN = 'Admin'
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  password?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}
