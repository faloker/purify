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
  GetProjectsQueryDto,
} from './dto/projects.dto';
import { Project as IProject } from './interfaces/project.interface';
import { UnitList } from 'src/units/dto/units.dto';
import { Roles } from 'src/common/decorators/roles.decorator';

@ApiBearerAuth()
@ApiSecurity('api_key', ['apikey'])
@ApiTags('projects')
@Controller('projects')
@UseGuards(GenericAuthGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @Roles(['owner'])
  @ApiOperation({ summary: 'Create project' })
  @ApiCreatedResponse({
    description: 'Created successfully',
    type: Project,
  })
  createProject(@Body() createProjectDto: CreateProjectDto): Promise<IProject> {
    return this.projectsService.create(createProjectDto);
  }

  @Get()
  @ApiOperation({ summary: 'List projects' })
  @ApiOkResponse({
    description: 'List of projects',
  })
  getProjects(@Query() query: GetProjectsQueryDto) {
    return this.projectsService.getAll(query.verbose);
  }

  @Patch(':projectName')
  @ApiOperation({ summary: 'Update a project by name' })
  @ApiOkResponse({
    description: 'Update successful',
    type: Project,
  })
  @ApiNotFoundResponse({ description: 'No such project' })
  editProject(
    @Param('projectName') name: string,
    @Body() editProjectDto: EditProjectDto
  ): Promise<IProject> {
    return this.projectsService.edit(name, editProjectDto);
  }

  @Delete(':projectName')
  @Roles(['owner'])
  @ApiOperation({ summary: 'Delete project' })
  @ApiNoContentResponse({ description: 'Removed successfully' })
  @ApiNotFoundResponse({ description: 'No such project' })
  @HttpCode(204)
  deleteProject(@Param('projectName') name: string) {
    return this.projectsService.delete(name);
  }

  @Get(':projectName/stats')
  @ApiOperation({ summary: 'Get project statistics' })
  @ApiOkResponse({
    description: 'Yearly statistics for the project and units',
    type: ProjectStatistics,
  })
  @ApiNotFoundResponse({ description: 'No such project' })
  getStats(@Param('projectName') name: string) {
    return this.projectsService.getStats(name);
  }

  // @Get(':projectName/units')
  // @ApiOperation({ summary: 'List units in the project' })
  // @ApiOkResponse({
  //   description: 'List of units',
  //   type: [UnitList],
  // })
  // getUnits(@Param('projectName') name: string) {
  //   return this.projectsService.getUnits(name);
  // }
}
