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
  NotFoundException,
  Req,
  BadRequestException,
  UseInterceptors,
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
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { User, Role } from './interfaces/user.interface';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { EventsService } from 'src/events/events.service';
import { EventType, Audience } from 'src/events/interfaces/event.interface';
import { UserInterceptor } from 'src/common/interceptors/user.interceptor';

@UseGuards(RolesGuard)
@UseGuards(GenericAuthGuard)
@Controller('users')
@ApiBearerAuth()
@ApiSecurity('api_key', ['apikey'])
@ApiTags('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly eventsService: EventsService
  ) {}

  @Get('current_user')
  async currentUser(@Request() req) {
    const {
      _id,
      name,
      email,
      image,
      role,
      memberships,
    } = await this.usersService.findOne({
      _id: req.user.id,
    });
    return { _id, name, email, image, role, memberships };
  }

  @Get()
  @Roles(['owner', 'admin'])
  @ApiOperation({ summary: 'List users' })
  @ApiOkResponse({
    description: 'List of users',
    type: [UserList],
  })
  async getAllUsers(): Promise<UserList[]> {
    return this.usersService.getAll();
  }

  @Post()
  @Roles(['owner', 'admin'])
  @ApiOperation({ summary: 'Create user' })
  @ApiCreatedResponse({ description: 'Created successfully' })
  async createUser(@Body() createUserDto: CreateUserDto, @Req() req) {
    if (req.user.role === Role.ADMIN) {
      if (
        createUserDto.memberships.length > 1 ||
        !req.user.memberships.includes(createUserDto.memberships[0]) ||
        createUserDto.role === Role.OWNER
      ) {
        throw new BadRequestException();
      }
    }
    const user = await this.usersService.createUser(createUserDto);
    await this.eventsService.add(
      EventType.USER_CREATED,
      { email: user.email, role: user.role },
      req.user._id,
      Audience.OWNERS
    );
    const link = await this.usersService.createInviteLink(user._id);
    return { link };
  }

  @Post(':id/reset_password')
  @Roles(['owner'])
  @UseInterceptors(UserInterceptor)
  @ApiOperation({ summary: "Reset user's password by id" })
  @ApiOkResponse({ description: 'Password reset link', type: String })
  @ApiNotFoundResponse({ description: 'No such user' })
  async resetUserPassword(@Param('id') user: User) {
    const link = await this.usersService.createInviteLink(user._id);
    return { link };
  }

  @Patch(':id')
  @Roles(['owner'])
  @UseInterceptors(UserInterceptor)
  @ApiOperation({ summary: 'Edit user by id' })
  @ApiOkResponse({ description: 'Updated successfully' })
  @ApiNotFoundResponse({ description: 'No such user' })
  async editUser(
    @Param('id') user: User,
    @Body() editUserDto: EditUserDto
  ) {
    return this.usersService.editUser(user._id, editUserDto);
  }

  @Delete(':id')
  @Roles(['owner'])
  @UseInterceptors(UserInterceptor)
  @ApiOperation({ summary: 'Delete user by id' })
  @ApiNoContentResponse({ description: 'Removed successfully' })
  @ApiNotFoundResponse({ description: 'No such user' })
  @HttpCode(204)
  async deleteUser(@Param('id') user: User, @Req() req) {
    await this.usersService.delete(user._id);
    await this.eventsService.add(
      EventType.USER_DELETED,
      { email: user.email, role: user.role },
      req.user._id,
      Audience.OWNERS
    );
  }
}
