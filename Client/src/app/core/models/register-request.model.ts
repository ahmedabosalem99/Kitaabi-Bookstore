import { UserRole } from './UserRole';

export interface RegisterRequest {
  Fname: string;
  Lname: string;
  email: string;
  password: string;
  mobileNumber: string;
  role: UserRole;
  isVerify: boolean;
}
