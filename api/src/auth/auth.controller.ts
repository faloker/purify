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
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { ChangePasswordDto } from 'src/users/dto/user.dto';
import { ConfigService } from '@nestjs/config';
import { GenericAuthGuard } from './generic-auth.guard';
import { CredentialsAuthGuard } from './credentials-auth.guard';
import {
  ApiTags,
  ApiBody,
  ApiExcludeEndpoint,
  ApiOperation,
  ApiOkResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { SamlAuthGuard } from './saml-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  cookiesConfig: any;

  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService
  ) {
    this.cookiesConfig = {
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
        email: { type: 'string' },
        password: { type: 'string' },
      },
    },
  })
  @UseGuards(CredentialsAuthGuard)
  async login(@Request() req, @Res() response) {
    const tokens = await this.authService.login(req.user);

    response
      .status(200)
      .cookie('refreshToken', tokens.refreshToken, this.cookiesConfig)
      .send({ token: tokens.accessToken });
  }

  @Get('refresh_token')
  @ApiExcludeEndpoint()
  async refreshToken(@Request() req, @Res() response) {
    if (req.cookies) {
      try {
        const tokens = await this.authService.refreshToken(
          req.cookies.refreshToken
        );

        response
          .cookie('refreshToken', tokens.refreshToken, this.cookiesConfig)
          .send({ token: tokens.accessToken });
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

  @Delete()
  @ApiExcludeEndpoint()
  @UseGuards(GenericAuthGuard)
  async logout(@Request() req, @Res() response) {
    await this.authService.removeRefreshToken(req.user);
    response.clearCookie('refreshToken', this.cookiesConfig).send('bye');
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
      .cookie('refreshToken', tokens.refreshToken, this.cookiesConfig)
      .redirect(
        `https://${this.configService.get<string>(
          'DOMAIN'
        )}/#/saml/login/${Buffer.from(tokens.accessToken).toString('base64')}`
      );
  }

  @Post('change_password')
  @ApiOperation({ summary: 'Change user password' })
  @ApiOkResponse({ description: 'Changed successfully' })
  @ApiNotFoundResponse({ description: 'No such token' })
  changePassword(@Body() changePasswordDto: ChangePasswordDto) {
    return this.usersService.changePassword(changePasswordDto);
  }
}
