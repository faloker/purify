// import { Injectable } from '@nestjs/common';
// import { AuthGuard } from '@nestjs/passport';

// @Injectable()
// export class GenericAuthGuard extends AuthGuard(['localapikey', 'jwt']) {}
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JWTAuthGuard } from './jwt-auth.guard';
import { APIKeyAuthGuard } from './apikey-auth.guard';
import { UsersService } from 'src/users/users.service';
import { Observable } from 'rxjs';

@Injectable()
export class GenericAuthGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}
  async canActivate(context: ExecutionContext): Promise<any> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['apikey'] || '';
    if (token) {
      await this.usersService.trackTokenUsage(
        request.ip,
        request.headers['user-agent'],
        token
      );
      return new APIKeyAuthGuard().canActivate(context);
    }
    return new JWTAuthGuard().canActivate(context);
  }
}
