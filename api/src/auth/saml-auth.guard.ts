/* istanbul ignore file */

import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';

@Injectable()
export class SamlAuthGuard extends AuthGuard('saml') {
  constructor(private readonly configService: ConfigService) {
    super();
  }
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    if (this.configService.get<string>('USE_SAML') === 'true') {
      return super.canActivate(context);
    }

    return false;
  }
}
