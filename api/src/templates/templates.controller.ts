import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Patch,
  Delete,
  Param,
  HttpCode,
  Query,
  UseInterceptors,
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
} from '@nestjs/swagger';
import { TemplatesService } from './templates.service';
import {
  CreateTemplateDto,
  EditTemplateDto,
  TemplateList,
  Template,
  GetTemplatesQueryDto,
} from './dto/templates.dto';
import { GenericAuthGuard } from 'src/auth/generic-auth.guard';
import { Template as ITemplate } from './interfaces/template.interface';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { HttpCacheInterceptor } from 'src/common/interceptors/cache.interceptor';

@UseGuards(RolesGuard)
@UseGuards(GenericAuthGuard)
@ApiBearerAuth()
@ApiSecurity('api_key', ['apikey'])
@ApiTags('templates')
@Controller('templates')
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  @Post()
  @Roles(['owner', 'admin', 'user'])
  @ApiOperation({ summary: 'Create template' })
  @ApiCreatedResponse({
    description: 'Created successfully',
    type: Template,
  })
  createTemplate(@Body() template: CreateTemplateDto): Promise<ITemplate> {
    return this.templatesService.save(template);
  }

  @Get()
  @Roles(['owner', 'admin', 'user', 'observer'])
  @ApiOperation({ summary: 'List templates' })
  @ApiOkResponse({
    description: 'List of templates',
    type: [TemplateList],
  })
  findAll(@Query() query: GetTemplatesQueryDto) {
    return this.templatesService.findAll(query);
  }

  @Patch(':templateName')
  @Roles(['owner', 'admin', 'user'])
  @ApiOperation({ summary: 'Update template' })
  @ApiOkResponse({
    description: 'Update successful',
    type: Template,
  })
  @ApiNotFoundResponse({ description: 'No such template' })
  updateOne(
    @Param('templateName') name: string,
    @Body() template: EditTemplateDto
  ) {
    return this.templatesService.updateOne(name, template);
  }

  @Delete(':templateName')
  @Roles(['owner', 'admin', 'user'])
  @ApiOperation({ summary: 'Delete template' })
  @ApiNoContentResponse({ description: 'Removed successfully' })
  @ApiNotFoundResponse({ description: 'No such template' })
  @HttpCode(204)
  deleteOne(@Param('templateName') name: string) {
    return this.templatesService.deleteOne(name);
  }
}
