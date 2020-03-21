import { Controller, Post, Body, Get, UseGuards, Patch, Delete, Param } from '@nestjs/common';
import { TemplatesService } from './templates.service';
import { IdParamDto, SaveTemplateDto, EditTemplateBodyDto } from './dto/templates.dto';
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
  findAll() {
    return this.templatesService.findAll();
  }  
  
  @Patch(':id')
  updateOne(@Param() param: IdParamDto, @Body() template: EditTemplateBodyDto) {
    return this.templatesService.updateOne(param.id, template);
  }  
  
  @Delete(':id')
  deleteOne() {
    return this.templatesService.deleteOne();
  }
}
