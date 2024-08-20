import { SetMetadata } from '@nestjs/common';
import { Role } from './entities/role.enum';

export const Roles = (...role: Role[]) => SetMetadata('role', role);
