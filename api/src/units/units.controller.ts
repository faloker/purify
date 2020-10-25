import {
  Get,
  Post,
  Body,
  Param,
  Query,
  Delete,
  HttpCode,
  UseGuards,
  Controller,
  Patch,
  NotFoundException,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UnitsService } from './units.service';
import { GenericAuthGuard } from 'src/auth/generic-auth.guard';
import { CreateUnitDto, EditUnitDto } from './dto/units.dto';
import { Unit } from './interfaces/unit.interface';
import {
  ApiTags,
  ApiSecurity,
  ApiOperation,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiParam,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Project } from 'src/projects/interfaces/project.interface';
import { ProjectInterceptor } from 'src/common/interceptors/project.interceptor';
import { UnitInterceptor } from 'src/common/interceptors/unit.interceptor';
import { IssuesService } from 'src/issues/issues.service';
import { GetIssuesQueryDto } from 'src/issues/dto/issues.dto';
import { FileUploadDto } from 'src/reports/dto/reports.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ReportsService } from 'src/reports/reports.service';

@UseGuards(RolesGuard)
@UseGuards(GenericAuthGuard)
@UseInterceptors(UnitInterceptor)
@ApiBearerAuth()
@ApiSecurity('api_key', ['apikey'])
@Controller('units')
export class UnitsController {
  constructor(
    private readonly unitsService: UnitsService,
    private readonly reportsService: ReportsService
  ) {}

  @Patch(':unitName')
  @Roles(['owner', 'admin'])
  @ApiOperation({ summary: 'Update unit by name' })
  @ApiOkResponse({ description: 'Update successful' })
  @ApiNotFoundResponse({ description: 'No such unit' })
  @ApiParam({ name: 'unitName', type: 'string', required: true })
  @ApiTags('units')
  editUnit(@Param('unitName') unit: Unit, @Body() editUnitDto: EditUnitDto) {
    return this.unitsService.updateOne(unit, editUnitDto);
  }

  @Delete(':unitName')
  @Roles(['owner', 'admin'])
  @ApiOperation({ summary: 'Delete unit by name' })
  @ApiNoContentResponse({ description: 'Removed successfully' })
  @ApiNotFoundResponse({ description: 'No such unit' })
  @ApiParam({ name: 'unitName', type: 'string', required: true })
  @ApiTags('units')
  @HttpCode(204)
  deleteUnit(@Param('unitName') unit: Unit) {
    return this.unitsService.deleteOne(unit._id);
  }

  @Get(':unitName/reports')
  @Roles(['owner', 'admin', 'user', 'observer'])
  @ApiOperation({ summary: 'List reports' })
  @ApiOkResponse({ description: 'List of reports' })
  @ApiParam({ name: 'unitName', type: 'string', required: true })
  getReports(@Param('unitName') unit: Unit) {
    return this.reportsService.getReports(unit._id);
  }

  @Post(':unitName/reports')
  @Roles(['owner', 'admin', 'user'])
  @ApiOperation({ summary: 'Upload file' })
  @ApiCreatedResponse({ description: 'Upload successfull' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'The file to upload',
    type: FileUploadDto,
  })
  @ApiParam({ name: 'unitName', type: 'string', required: true })
  @UseInterceptors(FileInterceptor('file'))
  saveReport(
    @UploadedFile() file,
    @Param('unitName') unit: Unit,
    @Body() body: FileUploadDto
  ) {
    return this.reportsService.saveFileReport(file, unit, body.template);
  }

  @Post(':unitName/oneshots')
  @Roles(['owner', 'admin', 'user'])
  @ApiOperation({ summary: 'Upload JSON object' })
  @ApiCreatedResponse({ description: 'Upload successfull' })
  @ApiParam({ name: 'unitName', type: 'string', required: true })
  saveOneshot(@Body() body: any, @Param('unitName') unit: Unit) {
    return this.reportsService.saveOneshot(body, unit);
  }

  @Post(':unitName/oneshots/:templateName')
  @ApiOperation({
    summary: 'Upload JSON object and apply the template',
  })
  @ApiCreatedResponse({ description: 'Upload successfull' })
  @ApiNotFoundResponse({ description: 'No such template' })
  saveOneshotWithTemplate(
    @Body() body: any,
    @Param('unitName') unit: Unit,
    @Param('templateName') templateName: string
  ) {
    return this.reportsService.saveOneshot(body, unit, templateName);
  }
}
