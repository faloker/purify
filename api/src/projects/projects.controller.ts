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
import { ProjectsService } from './projects.service';
import { GenericAuthGuard } from '../auth/generic-auth.guard';
import { ProjectDto, GetStatsDto } from './dto/projects.dto';

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
  editProject(@Param() params, @Body() projectDto: ProjectDto) {
    return this.projectsService.edit(params.id, projectDto);
  }

  @Delete(':id')
  deleteProject(@Param() params) {
    return this.projectsService.delete(params.id);
  }

  @Get('stats')
  getStats(@Query() query: GetStatsDto) {
    return this.projectsService.getStats(query.project)
  }
}
