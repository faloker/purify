import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  HttpCode,
  Request,
} from '@nestjs/common';
import { CreateUserDto } from './dto/user.dto';
import { UsersService } from './users.service';
import { User } from './interfaces/user.interface';
import { GenericAuthGuard } from '../auth/generic-auth.guard';

@Controller('api/users')
@UseGuards(GenericAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    this.usersService.createUser(createUserDto);
  }

  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
