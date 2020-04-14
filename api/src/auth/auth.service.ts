/* eslint-disable @typescript-eslint/camelcase */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/interfaces/user.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne({ username });
    if (
      user &&
      this.usersService.isSecretValid(pass, user.password, user.salt)
    ) {
      return user;
    }
    return null;
  }

  async validateAPIKey(apikey: string): Promise<any> {
    const [username, token] = Buffer.from(apikey, 'base64')
      .toString()
      .split(':');

    const user = await this.usersService.findOne({ username });
    if (user && this.usersService.isSecretValid(token, user.token, user.salt)) {
      return user;
    }
    return null;
  }

  async login(user: User) {
    const refresh_token = this.jwtService.sign(
      { id: user._id, type: 'refresh_token' },
      { expiresIn: '24h' }
    );
    await this.usersService.saveRefreshToken(user._id, refresh_token);

    return {
      access_token: this.jwtService.sign({
        id: user._id,
        type: 'access_token',
      }),
      refresh_token,
    };
  }

  issueToken(user: User) {
    return this.usersService.createToken(user);
  }

  async refreshToken(token: string) {
    const { id, type } = await this.jwtService.verify(token);

    if (
      type === 'refresh_token' &&
      this.usersService.validateRefreshToken(id, token)
    ) {
      const refresh_token = this.jwtService.sign(
        { id, type: 'refresh_token' },
        { expiresIn: '72h' }
      );
      await this.usersService.saveRefreshToken(id, refresh_token);

      return {
        access_token: this.jwtService.sign({ id, type: 'access_token' }),
        refresh_token,
      };
    } else {
      throw new Error('Invalid refresh token');
    }
  }
}
