/* eslint-disable @typescript-eslint/camelcase */
import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/interfaces/user.interface';
import { randomBytes } from 'crypto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne({ email, type: 'local' });

    if (
      user &&
      this.usersService.isSecretValid(pass, user.password, user.salt)
    ) {
      return user;
    } else {
      return null;
    }
  }

  async validateADUser(user: any): Promise<any> {
    const entity = await this.usersService.findOne({
      email: user.uid,
      type: 'ldap',
    });

    if (!entity) {
      // return this.usersService.createUser({
      //   username: user.uid,
      //   password: randomBytes(16).toString('hex'),
      //   email: user.mail,
      //   type: 'ldap',
      // });
    } else {
      return entity;
    }
  }

  async validateSAMLUser(user: any) {
    const doc = await this.usersService.findOne({
      email: user[this.configService.get<string>('SAML_EMAIL_FIELD_NAME')],
    });
    if (doc) {
      return doc;
    } else {
      throw new NotFoundException('No such user');
    }
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
    const refreshToken = this.jwtService.sign(
      { id: user._id, type: 'refreshToken' },
      { expiresIn: '72h' }
    );
    await this.usersService.saveRefreshToken(user._id, refreshToken);

    return {
      accessToken: this.jwtService.sign({
        id: user._id,
        type: 'accessToken',
      }),
      refreshToken,
    };
  }

  issueToken(user: User) {
    return this.usersService.createToken(user);
  }

  async refreshToken(token: string) {
    const { id, type } = await this.jwtService.verify(token);

    if (
      type === 'refreshToken' &&
      this.usersService.validateRefreshToken(id, token)
    ) {
      const refreshToken = this.jwtService.sign(
        { id, type: 'refreshToken' },
        { expiresIn: '72h' }
      );
      await this.usersService.saveRefreshToken(id, refreshToken);

      return {
        accessToken: this.jwtService.sign({ id, type: 'accessToken' }),
        refreshToken,
      };
    } else {
      throw new Error('Invalid refresh token');
    }
  }

  async removeRefreshToken(userId: string) {
    await this.usersService.removeRefreshToken(userId);
  }
}
