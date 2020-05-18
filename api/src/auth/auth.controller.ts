import {
  Controller,
  Post,
  UseGuards,
  HttpStatus,
  Request,
  Get,
  Res,
  Body,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/user.dto';
import { ConfigService } from '@nestjs/config';
import { GenericAuthGuard } from './generic-auth.guard';
import { CredentialsAuthGuard } from './credentials-auth.guard';
import { ApiTags, ApiBody, ApiExcludeEndpoint } from '@nestjs/swagger';

@ApiTags('auth')
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
      sameSite: 'lax',
    };
  }

  @Post()
  @ApiBody({
    description: 'Returns JWT token for authorization flow.',
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string' },
        password: { type: 'string' },
      },
    },
  })
  @UseGuards(CredentialsAuthGuard)
  async login(@Request() req, @Res() response) {
    const tokens = await this.authService.login(req.user);

    response
      .setCookie('refresh_token', tokens.refresh_token, this.cookieConfig)
      .code(200)
      .send({ token: tokens.access_token });
  }

  @Post('signup')
  async register(@Body() createUserDto: CreateUserDto, @Res() response) {
    if (this.configService.get<string>('ALLOW_REGISTRATION') === 'false') {
      throw new BadRequestException(
        'Registration is disabled for this installation'
      );
    }

    const newUser = await this.usersService.createUser(createUserDto);
    const tokens = await this.authService.login(newUser);

    response
      .setCookie('refresh_token', tokens.refresh_token, this.cookieConfig)
      .send({ token: tokens.access_token });
  }

  @Get('refresh_token')
  @ApiExcludeEndpoint()
  async refreshToken(@Request() req, @Res() response) {
    const token = req.cookies.refresh_token;

    if (token) {
      try {
        const tokens = await this.authService.refreshToken(token);

        response
          .setCookie('refresh_token', tokens.refresh_token, this.cookieConfig)
          .send({ token: tokens.access_token });
      } catch (err) {
        response.code(HttpStatus.UNAUTHORIZED).send({
          statusCode: HttpStatus.UNAUTHORIZED,
          message: 'Unauthorized',
        });
      }
    } else {
      response.code(HttpStatus.UNAUTHORIZED).send({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Unauthorized',
      });
    }
  }

  @Post('token')
  @ApiBody({
    description: 'Creates and returns API token for the current user.',
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string' },
        password: { type: 'string' },
      },
    },
  })
  @UseGuards(CredentialsAuthGuard)
  async issueToken(@Request() req) {
    return this.authService.issueToken(req.user);
  }

  @Delete()
  @ApiExcludeEndpoint()
  @UseGuards(GenericAuthGuard)
  async logout(@Request() req, @Res() response) {
    await this.authService.removeRefreshToken(req.user.id);
    response.clearCookie('refresh_token', this.cookieConfig).send('bye');
  }
}
