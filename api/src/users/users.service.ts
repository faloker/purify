/* eslint-disable @typescript-eslint/camelcase */
import { Model } from 'mongoose';
import { pbkdf2Sync, randomBytes } from 'crypto';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, Role } from './interfaces/user.interface';
import {
  CreateUserDto,
  ChangePasswordDto,
  EditUserDto,
  UserSelfChangeDto,
  CreateTokenDto,
  DeleteTokenDto,
  UserChangePasswordDto,
} from './dto/user.dto';
import { Token, TokenType } from './interfaces/token.interface';
import { ConfigService } from '@nestjs/config';
import { nanoid } from 'nanoid';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    @InjectModel('Token')
    private readonly tokenModel: Model<Token>,
    private readonly configService: ConfigService
  ) {}

  async getAll() {
    return this.userModel
      .find({}, { password: 0, token: 0, salt: 0, refreshToken: 0 })
      .lean()
      .populate('memberships', 'displayName');
  }

  async getUser(userId: string) {
    return this.userModel
      .findOne(
        {
          _id: userId,
        },
        '_id name email image ssoBypass'
      )
      .lean();
  }

  async getUserRecentProjects(userId: string) {
    return this.userModel
      .findOne(
        {
          _id: userId,
        },
        'recentProjects'
      )
      .lean();
  }

  async delete(userId: string) {
    await this.userModel.deleteOne({ _id: userId });
  }

  async createUser(newUser: CreateUserDto) {
    return new this.userModel({
      ...newUser,
      salt: randomBytes(16).toString('hex'),
      image: `https://api.adorable.io/avatars/285/${nanoid(10)}.png`,
    }).save();
  }

  async editUser(userId: string, user: EditUserDto) {
    return this.userModel.updateOne(
      { _id: userId },
      {
        name: user.name,
        email: user.email,
        role: user.role as Role,
        memberships: user.memberships,
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

  async getAPIAccessTokens(user: User) {
    return this.tokenModel
      .find(
        {
          user: user._id,
          type: TokenType.API_ACCESS_TOKEN,
        },
        { value: 0, user: 0, type: 0 }
      )
      .lean();
  }

  async createAPIAccessToken(user: User, createTokenDto: CreateTokenDto) {
    const doc = await this.tokenModel
      .findOne({
        user: user._id,
        name: createTokenDto.name,
        type: TokenType.API_ACCESS_TOKEN,
      })
      .lean();

    if (doc) {
      throw new BadRequestException('Token with this name already exists');
    }

    const token = await new this.tokenModel({
      user: user._id,
      name: createTokenDto.name,
      type: TokenType.API_ACCESS_TOKEN,
    }).save();

    return {
      value: token.value,
      _id: token._id,
      name: token.name,
    };
  }

  async trackTokenUsage(ip: string, ua: string, apikey: string) {
    const token = await this.tokenModel.findOne({
      value: apikey,
      type: TokenType.API_ACCESS_TOKEN,
    });

    if (token) {
      token.lastActivity.date = new Date();
      token.lastActivity.fromIP = ip;
      token.lastActivity.userAgent = ua;
      await token.save();
    }
  }

  async deleteAPIAccessToken(user: User, deleteTokenDto: DeleteTokenDto) {
    await this.tokenModel.deleteOne({
      user: user._id,
      _id: deleteTokenDto._id,
      type: TokenType.API_ACCESS_TOKEN,
    });
  }

  async validateAPIAccessToken(token: string) {
    return this.tokenModel
      .findOne({
        value: token,
        type: TokenType.API_ACCESS_TOKEN,
      })
      .lean();
  }

  async saveRefreshToken(userId: string, token: string) {
    return new this.tokenModel({
      user: userId,
      value: token,
      type: TokenType.REFRESH_TOKEN,
    }).save();
  }

  async validateRefreshToken(userId: string, refreshToken: string) {
    const token = this.tokenModel
      .findOne({
        user: userId,
        value: refreshToken,
        type: TokenType.REFRESH_TOKEN,
      })
      .lean();
    return token ? true : false;
  }

  async removeRefreshToken(user: User) {
    await this.tokenModel.deleteOne({
      user: user._id,
      type: TokenType.REFRESH_TOKEN,
    });
  }

  async createInviteLink(userId: string) {
    const { value } = await new this.tokenModel({
      user: userId,
      type: TokenType.INVITE_TOKEN,
    }).save();
    return `https://${this.configService.get<string>(
      'DOMAIN'
    )}/#/welcome/${value}`;
  }

  async changePassword(payload: ChangePasswordDto) {
    const token = await this.tokenModel
      .findOne({
        value: payload.token,
        type: TokenType.INVITE_TOKEN,
      })
      .lean();
    if (token) {
      const user = await this.userModel.findOne({ _id: token.user as string });
      const secret = this.genSecret(payload.password, user.salt);
      user.password = secret;
      await user.save();
      await this.tokenModel.deleteOne({ _id: token._id });
    } else {
      throw new NotFoundException('Token not found');
    }
  }

  async selfChangePassword(user: User, payload: UserChangePasswordDto) {
    if (this.isSecretValid(payload.oldPassword, user.password, user.salt)) {
      const secret = this.genSecret(payload.newPassword, user.salt);
      user.password = secret;
      await user.save();
    } else {
      throw new NotFoundException('Bad passwords');
    }
  }

  async changeUser(userId: string, userSelfChange: UserSelfChangeDto) {
    const user = await this.userModel.findOne({ _id: userId });
    if (
      userSelfChange.trackMe &&
      !user.recentProjects.includes(userSelfChange.trackMe)
    ) {
      if (user.recentProjects.length < 4) {
        user.recentProjects.push(userSelfChange.trackMe);
      } else {
        user.recentProjects.shift();
        user.recentProjects.push(userSelfChange.trackMe);
      }
      await user.save();
    }

    if (userSelfChange.name) {
      user.name = userSelfChange.name;
      await user.save();
    }
  }
}
