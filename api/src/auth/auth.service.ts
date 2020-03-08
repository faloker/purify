import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/interfaces/user.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
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

    const user = await this.usersService.findOne(username);
    if (user && this.usersService.isSecretValid(token, user.token, user.salt)) {
      return user;
    }
    return null;
  }

  async login(user: User) {
    const payload = { id: user._id };
    return {
      token: this.jwtService.sign(payload),
    };
  }

  issueToken(user: User) {
    return this.usersService.createToken(user)
  }
}
