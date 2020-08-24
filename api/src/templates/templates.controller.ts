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
  EditTemplateBodyDto,
  TemplateList,
  Template,
} from './dto/templates.dto';
import { GenericAuthGuard } from 'src/auth/generic-auth.guard';
import { Template as ITemplate } from './interfaces/template.interface';

@ApiBearerAuth()
@ApiSecurity('api_key', ['apikey'])
@ApiTags('templates')
@Controller('templates')
@UseGuards(GenericAuthGuard)
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  @Post()
  @ApiOperation({ summary: 'Create template' })
  @ApiCreatedResponse({
    description: 'Created successfully',
    type: Template,
  })
  createTemplate(@Body() template: CreateTemplateDto): Promise<ITemplate> {
    return this.templatesService.save(template);
  }

  @Get()
  @ApiOperation({ summary: 'List templates' })
  @ApiOkResponse({
    description: 'List of templates',
    type: [TemplateList],
  })
  findAll() {
    return this.templatesService.findAll();
  }

  @Patch(':slug')
  @ApiOperation({ summary: 'Update template by slug' })
  @ApiOkResponse({
    description: 'Update successful',
    type: Template,
  })
  @ApiNotFoundResponse({ description: 'No such template' })
  updateOne(
    @Param('slug') slug: string,
    @Body() template: EditTemplateBodyDto
  ): Promise<ITemplate> {
    return this.templatesService.updateOne(slug, template);
  }

  @Delete(':slug')
  @ApiOperation({ summary: 'Delete template by slug' })
  @ApiNoContentResponse({ description: 'Removed successfully' })
  @ApiNotFoundResponse({ description: 'No such template' })
  @HttpCode(204)
  deleteOne(@Param('slug') slug: string) {
    return this.templatesService.deleteOne(slug);
  }
}
