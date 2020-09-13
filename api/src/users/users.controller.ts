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
  UserSelfChangeDto,
  CreateTokenDto,
  DeleteTokenDto,
  UserChangePasswordDto,
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
@Controller('/')
@ApiBearerAuth()
@ApiSecurity('api_key', ['apikey'])
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly eventsService: EventsService
  ) {}

  @Get('whoami')
  @ApiTags('whoami')
  async getCurrentUser(@Request() req) {
    return this.usersService.getUser(req.user._id);
  }

  @Get('whoami/recent_projects')
  @ApiTags('whoami')
  async getUserRecentProjects(@Request() req) {
    return this.usersService.getUserRecentProjects(req.user._id);
  }

  @Patch('whoami')
  @ApiTags('whoami')
  @HttpCode(204)
  async changeCurrentUser(
    @Request() req,
    @Body() userSelfChange: UserSelfChangeDto
  ) {
    await this.usersService.changeUser(req.user._id, userSelfChange);
  }

  @Patch('whoami/password')
  @ApiTags('whoami')
  @HttpCode(204)
  async changePassword(
    @Request() req,
    @Body() userChangePasswordDto: UserChangePasswordDto
  ) {
    await this.usersService.selfChangePassword(req.user, userChangePasswordDto);
  }

  @Get('whoami/tokens')
  @ApiTags('whoami')
  async getAPIAccessTokens(@Request() req) {
    return this.usersService.getAPIAccessTokens(req.user);
  }

  @Post('whoami/tokens')
  @ApiTags('whoami')
  async createAPIAccessToken(
    @Request() req,
    @Body() createTokenDto: CreateTokenDto
  ) {
    return this.usersService.createAPIAccessToken(req.user, createTokenDto);
  }

  @Delete('whoami/tokens')
  @ApiTags('whoami')
  @HttpCode(204)
  async deleteAPIAccessToken(
    @Request() req,
    @Body() deleteTokenDto: DeleteTokenDto
  ) {
    return this.usersService.deleteAPIAccessToken(req.user, deleteTokenDto);
  }

  @Get('users')
  @Roles(['owner', 'admin'])
  @ApiTags('users')
  @ApiOperation({ summary: 'List users' })
  @ApiOkResponse({
    description: 'List of users',
    type: [UserList],
  })
  async getAllUsers(): Promise<UserList[]> {
    return this.usersService.getAll();
  }

  @Post('users')
  @Roles(['owner', 'admin'])
  @ApiTags('users')
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

  @Post('users/:id/reset_password')
  @Roles(['owner'])
  @ApiTags('users')
  @UseInterceptors(UserInterceptor)
  @ApiOperation({ summary: "Reset user's password by id" })
  @ApiOkResponse({ description: 'Password reset link', type: String })
  @ApiNotFoundResponse({ description: 'No such user' })
  async resetUserPassword(@Param('id') user: User) {
    const link = await this.usersService.createInviteLink(user._id);
    return { link };
  }

  @Patch('users/:id')
  @Roles(['owner'])
  @ApiTags('users')
  @UseInterceptors(UserInterceptor)
  @ApiOperation({ summary: 'Edit user by id' })
  @ApiOkResponse({ description: 'Updated successfully' })
  @ApiNotFoundResponse({ description: 'No such user' })
  async editUser(@Param('id') user: User, @Body() editUserDto: EditUserDto) {
    return this.usersService.editUser(user._id, editUserDto);
  }

  @Delete('users/:id')
  @Roles(['owner'])
  @ApiTags('users')
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
