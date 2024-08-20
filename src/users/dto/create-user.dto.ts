import { Role } from '../entities/role.enum';

export class CreateUserDto {
  name: string;
  username: string;
  password: string;
  role: Role;
}
