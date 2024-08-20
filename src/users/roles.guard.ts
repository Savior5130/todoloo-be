import { CanActivate, Injectable, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from './entities/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requireRole = this.reflector.getAllAndOverride<Role>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requireRole) return true;

    const { user } = context.switchToHttp().getRequest();

    return user.role === requireRole;
  }
}
