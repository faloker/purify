import { Controller, Post, UseGuards, HttpCode, Request } from '@nestjs/common';
import { LocalAuthGuard } from '../auth/local-auth.guard';
import { AuthService } from './auth.service';

@Controller('api/auth')
@UseGuards(LocalAuthGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('token')
  async issueToken(@Request() req) {
    return this.authService.issueToken(req.user)
  }
}
