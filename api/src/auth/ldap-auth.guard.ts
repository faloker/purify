import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LdapAuthGuard extends AuthGuard('ldapauth') {
  handleRequest(err, user, info) {
    if (info && !user) {
      throw new UnauthorizedException(info.message);
    }
    return user;
  }
}
