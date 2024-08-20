import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { Role } from '../entities/role.enum';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  name: string;
  username: string;
  password: string;
  role: Role;
}
