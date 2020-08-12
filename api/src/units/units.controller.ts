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
} from '@nestjs/common';
import { UnitsService } from './units.service';
import { GenericAuthGuard } from 'src/auth/generic-auth.guard';
import { CreateUnitDto, Unit, EditUnitDto } from './dto/units.dto';
import { Unit as IUnit } from './interfaces/unit.interface';
import {
  ApiTags,
  ApiSecurity,
  ApiOperation,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiNoContentResponse,
  ApiOkResponse,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiSecurity('api_key', ['apikey'])
@ApiTags('units')
@Controller('units')
@UseGuards(GenericAuthGuard)
export class UnitsController {
  constructor(private readonly unitsService: UnitsService) {}

  @Post()
  @ApiOperation({ summary: 'Create unit' })
  @ApiCreatedResponse({
    description: 'Created successfully',
    type: Unit,
  })
  createUnit(@Body() createUnitDto: CreateUnitDto) {
    return this.unitsService.create(createUnitDto);
  }

  @Patch(':slug')
  @ApiOperation({ summary: 'Update unit by slug' })
  @ApiOkResponse({
    description: 'Update successful',
    type: Unit,
  })
  @ApiNotFoundResponse({ description: 'No such unit' })
  editProject(
    @Param('slug') slug: string,
    @Body() editUnitDto: EditUnitDto
  ): Promise<IUnit> {
    return this.unitsService.edit(slug, editUnitDto);
  }

  @Delete(':slug')
  @ApiOperation({ summary: 'Delete unit by slug' })
  @ApiNoContentResponse({ description: 'Delete successful' })
  @ApiNotFoundResponse({ description: 'No such unit' })
  @HttpCode(204)
  deleteUnit(@Param('slug') slug: string) {
    return this.unitsService.delete(slug);
  }
}
