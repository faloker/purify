import {
  Controller,
  Get,
  Delete,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { GetReportsDto } from './dto/reports.dto';
import { GenericAuthGuard } from 'src/auth/generic-auth.guard';
import { ApiTags, ApiBearerAuth, ApiSecurity } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiSecurity('api_key', ['apikey'])
@ApiTags('reports')
@Controller('reports')
@UseGuards(GenericAuthGuard)
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get()
  getReports(@Query() getReportsDto: GetReportsDto) {
    return this.reportsService.get(getReportsDto.unit);
  }

  @Get(':id/content')
  getContent(@Param('id') id: string) {
    return this.reportsService.getContent(id);
  }

  @Delete(':id')
  deleteReport(@Param('id') id: string) {
    return this.reportsService.delete(id);
  }
}
