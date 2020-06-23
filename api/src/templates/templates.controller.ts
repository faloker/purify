import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Patch,
  Delete,
  Param,
} from '@nestjs/common';
import { TemplatesService } from './templates.service';
import {
  IdParamDto,
  SaveTemplateDto,
  EditTemplateBodyDto,
} from './dto/templates.dto';
import { GenericAuthGuard } from 'src/auth/generic-auth.guard';
import { ApiTags, ApiBearerAuth, ApiSecurity } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiSecurity('api_key', ['apikey'])
@ApiTags('templates')
@Controller('templates')
@UseGuards(GenericAuthGuard)
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  @Post()
  saveTemplate(@Body() template: SaveTemplateDto) {
    return this.templatesService.save(template);
  }

  @Get()
  findAll() {
    return this.templatesService.findAll();
  }

  @Patch(':id')
  updateOne(@Param() params: IdParamDto, @Body() template: EditTemplateBodyDto) {
    return this.templatesService.updateOne(params.id, template);
  }

  @Delete(':id')
  deleteOne() {
    return this.templatesService.deleteOne();
  }
}
