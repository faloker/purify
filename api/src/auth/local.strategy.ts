import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService
  ) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(email, password);
    if (user) {
      if (
        this.configService.get<string>('USE_SAML') === 'true' &&
        !user.ssoBypass
      ) {
        throw new UnauthorizedException('Invalid email/password');
      }
      return user;
    } else {
      throw new UnauthorizedException('Invalid email/password');
    }
  }
}
