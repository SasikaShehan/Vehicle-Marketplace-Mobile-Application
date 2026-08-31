export enum UserRole {
  BUYER = 'Buyer',
  SELLER = 'Seller',
  ADMIN = 'Admin',
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: UserRole;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
}
