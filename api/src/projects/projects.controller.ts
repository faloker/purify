import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  HttpCode,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  Req,
  BadRequestException,
  CacheTTL,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiSecurity,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiParam,
} from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { GenericAuthGuard } from '../auth/generic-auth.guard';
import {
  ProjectStatistics,
  CreateProjectDto,
  EditProjectDto,
  ProjectList,
  ProjectDto,
  GetProjectsQueryDto,
  AddUserDto,
  GetMetricsQueryDto,
} from './dto/projects.dto';
import { Project } from './interfaces/project.interface';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ProjectInterceptor } from 'src/common/interceptors/project.interceptor';
import { UnitsService } from 'src/units/units.service';
import { CreateUnitDto } from 'src/units/dto/units.dto';
import { Role } from 'src/users/interfaces/user.interface';
import { EventsService } from 'src/events/events.service';
import { EventType, Audience } from 'src/events/interfaces/event.interface';
import { HttpCacheInterceptor } from 'src/common/interceptors/cache.interceptor';

@UseGuards(RolesGuard)
@UseGuards(GenericAuthGuard)
@UseInterceptors(ProjectInterceptor)
@ApiBearerAuth()
@ApiSecurity('api_key', ['apikey'])
@Controller('projects')
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly unitsService: UnitsService,
    private readonly eventsService: EventsService
  ) {}

  @Post()
  @Roles(['owner'])
  @ApiOperation({ summary: 'Create project' })
  @ApiCreatedResponse({
    description: 'Created successfully',
    type: ProjectDto,
  })
  @ApiTags('projects')
  async createProject(
    @Body() createProjectDto: CreateProjectDto,
    @Req() req
  ): Promise<Project> {
    const project = await this.projectsService.create(createProjectDto);
    if (project) {
      await this.eventsService.add(
        EventType.PROJECT_CREATED,
        { name: project.name, displayName: project.displayName },
        req.user._id,
        Audience.OWNERS
      );
    }
    return project;
  }

  @Get()
  @Roles(['owner', 'admin', 'user', 'observer'])
  @ApiOperation({ summary: 'List projects' })
  @ApiOkResponse({
    description: 'List of projects',
  })
  @ApiTags('projects')
  getProjects(@Query() query: GetProjectsQueryDto, @Req() req) {
    if (req.user.role !== Role.OWNER) {
      return this.projectsService.getAll(query, req.user.memberships);
    } else {
      return this.projectsService.getAll(query);
    }
  }

  @Patch(':projectName')
  @Roles(['owner', 'admin'])
  @ApiOperation({ summary: 'Update a project by name' })
  @ApiOkResponse({
    description: 'Update successful',
    type: ProjectDto,
  })
  @ApiNotFoundResponse({ description: 'No such project' })
  @ApiParam({ name: 'projectName', type: 'string', required: true })
  @ApiTags('projects')
  editProject(
    @Param('projectName') project: Project,
    @Body() editProjectDto: EditProjectDto
  ) {
    return this.projectsService.updateOne(project._id, editProjectDto);
  }

  @Delete(':projectName')
  @Roles(['owner'])
  @ApiOperation({ summary: 'Delete project' })
  @ApiNoContentResponse({ description: 'Removed successfully' })
  @ApiNotFoundResponse({ description: 'No such project' })
  @ApiParam({ name: 'projectName', type: 'string', required: true })
  @ApiTags('projects')
  @HttpCode(204)
  async deleteProject(@Param('projectName') project: Project, @Req() req) {
    await this.projectsService.deleteOne(project._id);
    await this.eventsService.add(
      EventType.PROJECT_DELETED,
      { name: project.name, displayName: project.displayName },
      req.user._id,
      Audience.OWNERS
    );
  }

  @Get(':projectName/metrics')
  @Roles(['owner', 'admin', 'user', 'observer'])
  @UseInterceptors(HttpCacheInterceptor)
  @CacheTTL(30)
  @ApiOperation({ summary: 'Get project metrics' })
  @ApiOkResponse({
    description: 'Metrics for the project and units',
    type: ProjectStatistics,
  })
  @ApiNotFoundResponse({ description: 'No such project' })
  @ApiTags('projects')
  getMetrics(
    @Param('projectName') project: Project,
    @Query() query: GetMetricsQueryDto
  ) {
    return this.projectsService.getMetrics(project, query);
  }

  @Get(':projectName/units')
  @Roles(['owner', 'admin', 'user', 'observer'])
  @ApiOperation({ summary: 'List units in the project' })
  @ApiOkResponse({ description: 'List of units' })
  @ApiParam({ name: 'projectName', type: 'string', required: true })
  @ApiTags('units')
  getUnits(@Param('projectName') project: Project) {
    return this.unitsService.getUnits(project._id);
  }

  @Post(':projectName/units')
  @Roles(['owner', 'admin'])
  @ApiOperation({ summary: 'Create unit' })
  @ApiCreatedResponse({ description: 'Created successfully' })
  @ApiParam({ name: 'projectName', type: 'string', required: true })
  @ApiTags('units')
  createUnit(
    @Param('projectName') project: Project,
    @Body() createUnitDto: CreateUnitDto
  ) {
    return this.unitsService.create(project, createUnitDto);
  }

  @Post(':projectName/users')
  @Roles(['owner', 'admin'])
  @ApiOperation({ summary: 'Add user to the project' })
  @ApiCreatedResponse({ description: 'Added' })
  @ApiParam({ name: 'projectName', type: 'string', required: true })
  @ApiTags('users')
  @HttpCode(204)
  addUser(
    @Param('projectName') project: Project,
    @Body() addUserDto: AddUserDto
  ) {
    return this.projectsService.addUser(project, addUserDto.userId);
  }

  @Delete(':projectName/users')
  @Roles(['owner', 'admin', 'user'])
  @ApiOperation({ summary: 'Remove user from the project' })
  @ApiCreatedResponse({ description: 'Removed' })
  @ApiParam({ name: 'projectName', type: 'string', required: true })
  @ApiTags('users')
  @HttpCode(204)
  removeUser(
    @Param('projectName') project: Project,
    @Body() addUserDto: AddUserDto,
    @Req() req
  ) {
    if (req.user._id === addUserDto.userId) {
      throw new BadRequestException('No you stay');
    }
    return this.projectsService.removeUser(project, addUserDto.userId);
  }
}
