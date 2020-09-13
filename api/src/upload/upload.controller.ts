import {
  Controller,
  UseGuards,
  Post,
  Body,
  Param,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiSecurity,
  ApiTags,
  ApiConsumes,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { GenericAuthGuard } from 'src/auth/generic-auth.guard';
import { ReportsService } from 'src/reports/reports.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { RolesGuard } from 'src/common/guards/roles.guard';

import { Unit } from 'src/units/interfaces/unit.interface';

@UseGuards(RolesGuard)
// @UseGuards(GenericAuthGuard)
@ApiBearerAuth()
@ApiSecurity('api_key', ['apikey'])
@ApiTags('upload')
@Controller('upload')
// @UseGuards(GenericAuthGuard)
export class UploadController {
  constructor(private reportsService: ReportsService) {}

  // @Post('oneshot')
  // @ApiOperation({ summary: 'Upload JSON object' })
  // @ApiCreatedResponse({ description: 'Upload successfull' })
  // @ApiParam({ name: 'projectName', type: 'string', required: true })
  // @ApiParam({ name: 'unitName', type: 'string', required: true })
  // saveOneshot(@Body() body: any, @Param('unitName') unit: Unit) {
  //   return this.reportsService.saveOneshot(body, unit._id);
  // }

  // @Post('oneshot/:templateName')
  // @ApiOperation({
  //   summary: 'Upload JSON object and apply the template',
  // })
  // @ApiCreatedResponse({ description: 'Upload successfull' })
  // @ApiNotFoundResponse({ description: 'No such template' })
  // saveOneshotWithTemplate(
  //   @Body() body: any,
  //   @Param('unitName') unit: Unit,
  //   @Param('templateName') templateName: string
  // ) {
  //   return this.reportsService.saveOneshot(body, unit._id, templateName);
  // }
}
