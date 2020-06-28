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
import { SamlAuthGuard } from './saml-auth.guard';

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
      .status(200)
      .cookie('refresh_token', tokens.refresh_token, this.cookieConfig)
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
      .cookie('refresh_token', tokens.refresh_token, this.cookieConfig)
      .send({ token: tokens.access_token });
  }

  @Get('refresh_token')
  @ApiExcludeEndpoint()
  async refreshToken(@Request() req, @Res() response) {
    if (req.cookies) {
      try {
        const tokens = await this.authService.refreshToken(
          req.cookies.refresh_token
        );

        response
          .cookie('refresh_token', tokens.refresh_token, this.cookieConfig)
          .send({ token: tokens.access_token });
      } catch (err) {
        response.status(HttpStatus.UNAUTHORIZED).send({
          statusCode: HttpStatus.UNAUTHORIZED,
          message: 'Unauthorized',
        });
      }
    } else {
      response.status(HttpStatus.UNAUTHORIZED).send({
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

  @Get('saml')
  @UseGuards(SamlAuthGuard)
  async samlLogin() {
    // placeholder to start SAML authentication flow
  }

  @Post('saml/callback')
  @UseGuards(SamlAuthGuard)
  async samlCallback(@Request() req, @Res() response) {
    const tokens = await this.authService.login(req.user);

    response
      .cookie('refresh_token', tokens.refresh_token, this.cookieConfig)
      .redirect(
        `https://${this.configService.get<string>(
          'DOMAIN'
        )}/#/saml/login/${Buffer.from(tokens.access_token).toString('base64')}`
      );
  }
}
