
import { Strategy } from 'passport-localapikey-update';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class APIKeyStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(apikey: string): Promise<any> {
    const user = await this.authService.validateAPIKey(apikey);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}