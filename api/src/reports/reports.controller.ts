import {
  Controller,
  Get,
  Delete,
  Param,
  UseGuards,
  UseInterceptors,
  HttpCode,
  CacheTTL,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { GenericAuthGuard } from 'src/auth/generic-auth.guard';
import {
  ApiTags,
  ApiBearerAuth,
  ApiSecurity,
  ApiOperation,
  ApiParam,
  ApiNoContentResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Report } from './interfaces/report.interface';
import { ReportInterceptor } from 'src/common/interceptors/report.interceptor';
import { HttpCacheInterceptor } from 'src/common/interceptors/cache.interceptor';

@UseGuards(RolesGuard)
@UseGuards(GenericAuthGuard)
@UseInterceptors(ReportInterceptor)
@ApiBearerAuth()
@ApiSecurity('api_key', ['apikey'])
@ApiTags('reports')
@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get(':id/content')
  @Roles(['owner', 'admin', 'user', 'observer'])
  @UseInterceptors(HttpCacheInterceptor)
  @CacheTTL(30)
  getContent(@Param('id') report: Report) {
    return this.reportsService.getContent(report._id);
  }

  @Delete(':id')
  @Roles(['owner', 'admin'])
  @ApiOperation({ summary: 'Delete report by id' })
  @ApiNoContentResponse({ description: 'Removed successfully' })
  @ApiNotFoundResponse({ description: 'No such report' })
  @ApiParam({ name: 'unitName', type: 'string', required: true })
  @HttpCode(204)
  deleteReport(@Param('id') report: Report) {
    return this.reportsService.deleteOne(report._id);
  }
}
