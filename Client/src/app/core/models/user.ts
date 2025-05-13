import { UserRole } from './UserRole';

export interface User {
  id: string;
  email: string;
  Fname: string;
  Lname: string;
  password: string;
  mobileNumber: string;
  role: UserRole;
  isVerify: boolean;
}
