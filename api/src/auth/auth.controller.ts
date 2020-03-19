import {
  Controller,
  Post,
  UseGuards,
  HttpCode,
  Request,
  Get,
  Res,
  Body,
} from '@nestjs/common';
import { LocalAuthGuard } from '../auth/local-auth.guard';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/user.dto';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  @Post()
  @UseGuards(LocalAuthGuard)
  async login(@Request() req, @Res() response) {
    try {
      const tokens = await this.authService.login(req.user);
      response
        .setCookie('refresh_token', tokens.refresh_token, {
          httpOnly: true,
          domain: this.configService.get<string>('DOMAIN'),
          path: '/',
          secure: true,
        })
        .send({ token: tokens.access_token });
    } catch (err) {
      response.code(400).send({
        message: err,
        error: 'Bad Request',
        statusCode: 400,
      });
    }
  }

  @Post('signup')
  async register(@Body() createUserDto: CreateUserDto, @Res() response) {
    try {
      const newUser = await this.usersService.createUser(createUserDto);
      const tokens = await this.authService.login(newUser);
      response
        .setCookie('refresh_token', tokens.refresh_token, {
          httpOnly: true,
          domain: this.configService.get<string>('DOMAIN'),
          path: '/',
          secure: true,
        })
        .send({ token: tokens.access_token });
    } catch (err) {
      response.code(400).send({
        message: err,
        error: 'Bad Request',
        statusCode: 400,
      });
    }
  }

  @Get('refresh_token')
  async refreshToken(@Request() req, @Res() response) {
    try {
      const tokens = await this.authService.refreshToken(
        req.cookies.refresh_token,
      );
      response
        .setCookie('refresh_token', tokens.refresh_token, {
          httpOnly: true,
          domain: this.configService.get<string>('DOMAIN'),
          path: '/',
          secure: true,
        })
        .send({ token: tokens.access_token });
    } catch (err) {
      response.code(401).send({
        error: 'Unauthorized',
        statusCode: 401,
      });
    }
  }

  @Post('token')
  @UseGuards(LocalAuthGuard)
  async issueToken(@Request() req) {
    return this.authService.issueToken(req.user);
  }
}
