import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  Delete,
  HttpCode,
  Param,
  Patch,
} from '@nestjs/common';
import {
  CreateUserDto,
  EditUserDto,
  UserList,
  ChangePasswordDto,
} from './dto/user.dto';
import { UsersService } from './users.service';
import { GenericAuthGuard } from '../auth/generic-auth.guard';
import {
  ApiTags,
  ApiBearerAuth,
  ApiSecurity,
  ApiOperation,
  ApiOkResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { User } from './interfaces/user.interface';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@UseGuards(RolesGuard)
@UseGuards(GenericAuthGuard)
@Controller('users')
@ApiBearerAuth()
@ApiSecurity('api_key', ['apikey'])
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('current_user')
  async currentUser(@Request() req) {
    const {
      _id,
      name,
      email,
      image,
      role,
      membership,
    } = await this.usersService.findOne({
      _id: req.user.id,
    });
    return { _id, name, email, image, role, membership };
  }

  @Get()
  @Roles(['owner'])
  @ApiOperation({ summary: 'List users' })
  @ApiOkResponse({
    description: 'List of users',
    type: [UserList],
  })
  async getAllUsers(): Promise<UserList[]> {
    return this.usersService.getAll();
  }

  @Post()
  @Roles(['owner'])
  async createUser(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.createUser(createUserDto);
    const link = await this.usersService.createInviteLink(user._id);
    return { link };
  }

  @Patch(':id')
  @Roles(['owner'])
  async editUser(
    @Param('id') userId: string,
    @Body() editUserDto: EditUserDto
  ) {
    return this.usersService.editUser(userId, editUserDto);
  }

  @Delete(':id')
  @Roles(['owner'])
  @ApiOperation({ summary: 'Delete user by id' })
  @ApiNoContentResponse({ description: 'Removed successfully' })
  @ApiNotFoundResponse({ description: 'No such user' })
  @HttpCode(204)
  deleteUser(@Param('id') userId: string) {
    return this.usersService.delete(userId);
  }
}
