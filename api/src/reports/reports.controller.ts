import { Controller, Post, Request, Get, Delete, Req, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { DeleteReportDto, GetReportsDto, GetReportContentDto } from './dto/reports.dto';
import { GenericAuthGuard } from 'src/auth/generic-auth.guard';
import { ApiTags, ApiBearerAuth, ApiSecurity } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiSecurity('api_key', ['apikey'])
@ApiTags('reports')
@Controller('reports')
@UseGuards(GenericAuthGuard)
export class ReportsController {
  constructor(private reportsService: ReportsService) {}
  
  @Post()
  saveReport(@Req() req) {
    return this.reportsService.save(req.body);
  }

  @Get()
  getReports(@Query() getReportsDto: GetReportsDto) {
    return this.reportsService.get(getReportsDto.unit)
  }

  @Get(':id/content')
  getContent(@Param('id') id: string) {
    return this.reportsService.getContent(id)
  }

  @Delete(':id')
  deleteReport(@Param('id') id: string) {
    return this.reportsService.delete(id)
  }
}
