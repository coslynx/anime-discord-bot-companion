import { UserRole } from '../../auth/enums/user-role.enum';

export interface User {
  id: number;
  username: string;
  email: string;
  password?: string;
  roles: UserRole[];
  profilePicture?: string;
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
  roles?: UserRole[];
}

export interface UpdateUserDto {
  username?: string;
  email?: string;
  password?: string;
  roles?: UserRole[];
  profilePicture?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}