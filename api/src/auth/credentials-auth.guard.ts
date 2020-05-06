import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { LdapAuthGuard } from './ldap-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';

@Injectable()
export class CredentialsAuthGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    if (this.configService.get<string>('USE_LDAP') === 'true') {
      return new LdapAuthGuard().canActivate(context);
    }

    return new LocalAuthGuard().canActivate(context);
  }
}
