import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from 'src/users/interfaces/user.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    if (!request.user) {
      return false;
    } else if (request.user.role === Role.OWNER) {
      return true;
    }

    const hasRole = () => roles.includes(request.user.role);
    const hasMembership = () =>
      request.user.membership.includes(request.params['projectName'] || '');

    return Object.keys(request.params).includes('projectName')
      ? hasRole() && hasMembership()
      : hasRole();
  }
}
