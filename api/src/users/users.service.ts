/* eslint-disable @typescript-eslint/camelcase */
import { Model } from 'mongoose';
import { pbkdf2Sync, randomBytes } from 'crypto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, Role } from './interfaces/user.interface';
import { CreateUserDto, ChangePasswordDto, EditUserDto } from './dto/user.dto';
import { InviteToken } from './interfaces/inviteToken.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    @InjectModel('InviteToken')
    private readonly inviteTokenModel: Model<InviteToken>,
    private readonly configService: ConfigService
  ) {}

  async getAll(): Promise<User[]> {
    return this.userModel.find(
      {},
      { password: 0, token: 0, salt: 0, refreshToken: 0 }
    );
  }

  async delete(userId: string) {
    const user = await this.userModel.findOne({ _id: userId });
    if (user) {
      await this.userModel.deleteOne({ _id: userId });
    } else {
      throw new NotFoundException('No such user');
    }
  }

  async createUser(newUser: CreateUserDto) {
    return new this.userModel({
      ...newUser,
      salt: randomBytes(16).toString('hex'),
    }).save();
  }

  async editUser(userId: string, user: EditUserDto) {
    return this.userModel.updateOne(
      { _id: userId },
      {
        name: user.name,
        email: user.email,
        role: user.role as Role,
        membership: user.membership,
        ssoBypass: user.ssoBypass,
      }
    );
  }

  async findOne(condition: any): Promise<User> {
    return this.userModel.findOne(condition);
  }

  genSecret(value: string, salt: string): string {
    return pbkdf2Sync(value, salt, 9999, 512, 'sha512').toString('hex');
  }

  isSecretValid(value: string, secret: string, salt: string): boolean {
    const hash = pbkdf2Sync(value, salt, 9999, 512, 'sha512').toString('hex');
    return secret === hash;
  }

  async createToken(user: User) {
    const token = randomBytes(16).toString('hex');
    const secret = this.genSecret(token, user.salt);

    await this.userModel.updateOne(
      { _id: user._id },
      { $set: { token: secret } }
    );
    return {
      apikey: Buffer.from(`${user.name}:${token}`).toString('base64'),
    };
  }

  async saveRefreshToken(userId: string, token: string) {
    const user = await this.userModel.findOne({ _id: userId });
    const secret = this.genSecret(token, user.salt);

    await this.userModel.updateOne(
      { _id: userId },
      { $set: { refreshToken: secret } }
    );
  }

  async validateRefreshToken(userId: string, token: string) {
    const user = await this.userModel.findOne({ _id: userId });
    return user
      ? this.isSecretValid(token, user.refreshToken, user.salt)
      : false;
  }

  async removeRefreshToken(userId: string) {
    await this.userModel.updateOne(
      { _id: userId },
      { $set: { refreshToken: '' } }
    );
  }

  async createInviteLink(userId: string) {
    const { value } = await new this.inviteTokenModel({ user: userId }).save();
    return `https://${this.configService.get<string>(
      'DOMAIN'
    )}/#/welcome/${value}`;
  }

  async changePassword(payload: ChangePasswordDto) {
    const token = await this.inviteTokenModel.findOne({ value: payload.token });
    if (token) {
      const user = await this.userModel.findOne({ _id: token.user as string });
      const secret = this.genSecret(payload.password, user.salt);

      await this.userModel.updateOne(
        { _id: user._id },
        { $set: { password: secret } }
      );
      await this.inviteTokenModel.deleteOne({ _id: token._id });
    } else {
      throw new NotFoundException('No such token');
    }
  }
}
