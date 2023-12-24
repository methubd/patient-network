import { Model } from 'mongoose';
import { USER_ROLE } from './user.constant';

export type User = {
  id: string;
  password: string;
  needsPasswordChange: boolean;
  passwordChangedAt: Date;
  role: 'patient' | 'doctor' | 'admin';
  email: string;
  status: 'in-progress' | 'blocked';
  isDeleted: boolean;
};

export interface UserModelStatic extends Model<User> {
  isJWTIssuedAfterBeforePasswordChanged(
    passwordChangedTimestamp: Date,
    jwtIssuedTimestamp: number,
  ): boolean;
}

export type TUserRole = keyof typeof USER_ROLE;
