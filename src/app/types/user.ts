import { USER_ROLE } from '../enum/user-role.enum';

export interface User {
  name: string;
  email: string;
  username: string;
  password: string;
  role?: USER_ROLE;
}
