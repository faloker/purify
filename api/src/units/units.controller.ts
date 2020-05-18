import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UnitsService } from './units.service';
import { GenericAuthGuard } from 'src/auth/generic-auth.guard';
import { GetUnitsDto, UnitDto, DeleteUnitDto } from './dto/units.dto';
import { ApiTags, ApiBearerAuth, ApiSecurity } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiSecurity('api_key', ['apikey'])
@ApiTags('units')
@Controller('units')
@UseGuards(GenericAuthGuard)
export class UnitsController {
  constructor(private readonly unitsService: UnitsService) {}

  @Get()
  getUnits(@Query() query: GetUnitsDto) {
    return this.unitsService.get(query.project);
  }

  @Post()
  createUnit(@Body() unit: UnitDto) {
    return this.unitsService.create(unit)
  }

  @Delete(':id')
  deleteProject(@Param('id') id: string) {
    return this.unitsService.delete(id);
  }
}
