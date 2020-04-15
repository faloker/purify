import {
  Controller,
  Post,
  UseGuards,
  HttpStatus,
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
  cookieConfig: any;

  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService
  ) {
    this.cookieConfig = {
      httpOnly: true,
      domain: this.configService.get<string>('DOMAIN'),
      path: '/',
      secure: this.configService.get<string>('SECURE') === 'true',
    };
  }

  @Post()
  @UseGuards(LocalAuthGuard)
  async login(@Request() req, @Res() response) {
    const tokens = await this.authService.login(req.user);
    response
      .setCookie('refresh_token', tokens.refresh_token, this.cookieConfig)
      .send({ token: tokens.access_token });
  }

  @Post('signup')
  async register(@Body() createUserDto: CreateUserDto, @Res() response) {
    const newUser = await this.usersService.createUser(createUserDto);
    const tokens = await this.authService.login(newUser);
    response
      .setCookie('refresh_token', tokens.refresh_token, this.cookieConfig)
      .send({ token: tokens.access_token });
  }

  @Get('refresh_token')
  async refreshToken(@Request() req, @Res() response) {
    const token = req.cookies.refresh_token;

    if (token) {
      const tokens = await this.authService.refreshToken(token);
      response
        .setCookie('refresh_token', tokens.refresh_token, this.cookieConfig)
        .send({ token: tokens.access_token });
    } else {
      response.code(HttpStatus.UNAUTHORIZED).send({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'No active session. Login again.',
      });
    }
  }

  @Post('token')
  @UseGuards(LocalAuthGuard)
  async issueToken(@Request() req) {
    return this.authService.issueToken(req.user);
  }
}
