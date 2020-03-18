import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { TemplatesService } from './templates.service';
import { SaveTemplateDto } from './dto/templates.dto';
import { GenericAuthGuard } from 'src/auth/generic-auth.guard';

@Controller('templates')
@UseGuards(GenericAuthGuard)
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  @Post()
  saveTemplate(@Body() template: SaveTemplateDto) {
    return this.templatesService.save(template)
  }

  @Get()
  fetchNamesAndTags() {
    return this.templatesService.fetchNamesAndTags();
  }
}
