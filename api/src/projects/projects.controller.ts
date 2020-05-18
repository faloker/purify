import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  HttpCode,
  Request,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiSecurity } from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { GenericAuthGuard } from '../auth/generic-auth.guard';
import { ProjectDto, GetStatsDto } from './dto/projects.dto';

@ApiBearerAuth()
@ApiSecurity('api_key', ['apikey'])
@ApiTags('projects')
@Controller('projects')
@UseGuards(GenericAuthGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  getAllProjects() {
    return this.projectsService.getAll();
  }

  @Post()
  createProject(@Body() projectDto: ProjectDto) {
    return this.projectsService.create(projectDto);
  }

  @Patch(':id')
  editProject(@Param('id') id: string, @Body() projectDto: ProjectDto) {
    return this.projectsService.edit(id, projectDto);
  }

  @Delete(':id')
  deleteProject(@Param('id') id: string) {
    return this.projectsService.delete(id);
  }

  @Get('stats')
  getStats(@Query() query: GetStatsDto) {
    return this.projectsService.getStats(query.project);
  }
}
