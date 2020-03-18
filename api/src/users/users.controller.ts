import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  HttpCode,
  Request,
  Req,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { CreateUserDto } from './dto/user.dto';
import { UsersService } from './users.service';
import { User } from './interfaces/user.interface';
import { GenericAuthGuard } from '../auth/generic-auth.guard';

@Controller('users')
@UseGuards(GenericAuthGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const newUser = await this.usersService.createUser(createUserDto);
    return { id: newUser._id };
  }

  @Get('current_user')
  async currentUser(@Request() req) {
    const { _id, username, email, image } = await this.usersService.findOne({
      _id: req.user.id,
    });
    return { id: _id, username, email, image };
  }
}
