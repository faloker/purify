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
} from '@nestjs/swagger';
import { GenericAuthGuard } from 'src/auth/generic-auth.guard';
import { ReportsService } from 'src/reports/reports.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadDto, UnitSlugDto, UnitAndTemplateSlugsDto } from './dto/upload.dto';

@ApiBearerAuth()
@ApiSecurity('api_key', ['apikey'])
@ApiTags('upload')
@Controller('upload')
@UseGuards(GenericAuthGuard)
export class UploadController {
  constructor(private reportsService: ReportsService) {}

  @Post('oneshot/:unitSlug')
  @ApiCreatedResponse({
    description: 'The object has been successfully uploaded.',
  })
  @ApiNotFoundResponse({
    description: 'No such unit.',
  })
  saveOneshot(@Body() body: any, @Param() unitSlugDto: UnitSlugDto) {
    return this.reportsService.saveOneshot(body, unitSlugDto.unitSlug);
  }

  @Post('oneshot/:unitSlug/:templateSlug')
  @ApiCreatedResponse({
    description: 'The object has been successfully uploaded.',
  })
  @ApiNotFoundResponse({
    description: 'No such unit or template.',
  })
  saveOneshotWithTemplate(
    @Body() body: any,
    @Param() unitAndTemplateSlugsDto: UnitAndTemplateSlugsDto
  ) {
    return this.reportsService.saveOneshot(
      body,
      unitAndTemplateSlugsDto.unitSlug,
      unitAndTemplateSlugsDto.templateSlug
    );
  }

  @Post('file/:unitSlug')
  @ApiCreatedResponse({
    description: 'The report has been successfully uploaded.',
  })
  @ApiNotFoundResponse({
    description: 'No such unit.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'The file to upload',
    type: FileUploadDto,
  })
  @UseInterceptors(FileInterceptor('file'))
  saveReport(
    @UploadedFile() file,
    @Param() unitSlugDto: UnitSlugDto
  ) {
    return this.reportsService.save(file, unitSlugDto.unitSlug);
  }

  @Post('file/:unitSlug/:templateSlug')
  @ApiCreatedResponse({
    description: 'The report has been successfully uploaded.',
  })
  @ApiNotFoundResponse({
    description: 'No such unit or template.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'The file to upload',
    type: FileUploadDto,
  })
  @UseInterceptors(FileInterceptor('file'))
  saveReportWithTemplate(
    @UploadedFile() file,
    @Param() unitAndTemplateSlugsDto: UnitAndTemplateSlugsDto
  ) {
    return this.reportsService.save(
      file,
      unitAndTemplateSlugsDto.unitSlug,
      unitAndTemplateSlugsDto.templateSlug
    );
  }
}
