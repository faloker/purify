import { Strategy } from 'passport-localapikey-update';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class APIKeyStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super();
  }

  async validate(apikey: string): Promise<any> {
    const token = await this.usersService.validateAPIAccessToken(apikey);
    if (!token) {
      throw new UnauthorizedException();
    }
    const user = await this.usersService.findOne({ _id: token.user });
    return user;
  }
}
