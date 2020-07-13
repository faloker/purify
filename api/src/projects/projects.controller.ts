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
} from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { GenericAuthGuard } from '../auth/generic-auth.guard';
import {
  ProjectStatistics,
  CreateProjectDto,
  EditProjectDto,
  ProjectList,
  Project,
} from './dto/projects.dto';
import { Project as IProject } from './interfaces/project.interface';
import { UnitList } from 'src/units/dto/units.dto';

@ApiBearerAuth()
@ApiSecurity('api_key', ['apikey'])
@ApiTags('projects')
@Controller('projects')
@UseGuards(GenericAuthGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  @ApiOperation({ summary: 'List projects' })
  @ApiOkResponse({
    description: 'List of projects',
    type: [ProjectList],
  })
  getProjects() {
    return this.projectsService.getAll();
  }

  @Post()
  @ApiOperation({ summary: 'Create project' })
  @ApiCreatedResponse({
    description: 'Created successfully',
    type: Project,
  })
  createProject(@Body() createProjectDto: CreateProjectDto): Promise<IProject> {
    return this.projectsService.create(createProjectDto);
  }

  @Patch(':slug')
  @ApiOperation({ summary: 'Update project by slug' })
  @ApiOkResponse({
    description: 'Update successful',
    type: Project,
  })
  @ApiNotFoundResponse({ description: 'No such project' })
  editProject(
    @Param('slug') slug: string,
    @Body() editProjectDto: EditProjectDto
  ): Promise<IProject> {
    return this.projectsService.edit(slug, editProjectDto);
  }

  @Delete(':slug')
  @ApiOperation({ summary: 'Delete project by slug' })
  @ApiNoContentResponse({ description: 'Delete successful' })
  @ApiNotFoundResponse({ description: 'No such project' })
  @HttpCode(204)
  deleteProject(@Param('slug') slug: string) {
    return this.projectsService.delete(slug);
  }

  @Get(':slug/stats')
  @ApiOperation({ summary: 'Get project statistics' })
  @ApiOkResponse({
    description: 'Yearly statistics for the project and units',
    type: ProjectStatistics,
  })
  @ApiNotFoundResponse({ description: 'No such project' })
  getStats(@Param('slug') slug: string) {
    return this.projectsService.getStats(slug);
  }

  @Get(':slug/units')
  @ApiOperation({ summary: 'List units in project' })
  @ApiOkResponse({
    description: 'List of units',
    type: [UnitList],
  })
  getUnits(@Param('slug') slug: string) {
    return this.projectsService.getUnits(slug);
  }
}
