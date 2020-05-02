/* eslint-disable @typescript-eslint/camelcase */
import { Model } from 'mongoose';
import { pbkdf2Sync, randomBytes } from 'crypto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './interfaces/user.interface';
import { CreateUserDto, LoginUserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async createUser(CreateUserDto: CreateUserDto): Promise<User> {
    const salt = randomBytes(16).toString('hex');
    const user = new this.userModel({
      ...CreateUserDto,
      image: `https://api.adorable.io/avatars/285/${CreateUserDto.username}.png`,
      salt,
      password: this.genSecret(CreateUserDto.password, salt),
    });

    return user.save();
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
      { $set: { token: secret } },
    );
    return {
      apikey: Buffer.from(`${user.username}:${token}`).toString('base64'),
    };
  }

  async saveRefreshToken(userId: string, token: string) {
    const user = await this.userModel.findOne({ _id: userId });
    const secret = this.genSecret(token, user.salt);

    await this.userModel.updateOne(
      { _id: userId },
      { $set: { refresh_token: secret } },
    );
  }

  async validateRefreshToken(userId: string, token: string) {
    const user = await this.userModel.findOne({ _id: userId });
    return this.isSecretValid(token, user.refresh_token, user.salt);
  }

  async removeRefreshToken(userId: string) {
    await this.userModel.updateOne(
      { _id: userId },
      { $set: { refresh_token: '' } },
    );
  }
}
