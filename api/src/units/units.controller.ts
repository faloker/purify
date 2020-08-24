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
} from '@nestjs/common';
import { UnitsService } from './units.service';
import { GenericAuthGuard } from 'src/auth/generic-auth.guard';
import { CreateUnitDto, Unit, EditUnitDto, UnitList } from './dto/units.dto';
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
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';

@UseGuards(RolesGuard)
@UseGuards(GenericAuthGuard)
@Controller('projects/:projectName/units')
@ApiBearerAuth()
@ApiSecurity('api_key', ['apikey'])
@ApiTags('units')
export class UnitsController {
  constructor(private readonly unitsService: UnitsService) {}

  @Get()
  @Roles(['owner', 'admin', 'user', 'observer'])
  @ApiOperation({ summary: 'List units in the project' })
  @ApiOkResponse({
    description: 'List of units',
    type: [UnitList],
  })
  getUnits(@Param('projectName') projectName: string) {
    return this.unitsService.getUnits(projectName);
  }

  @Post()
  @Roles(['owner', 'admin'])
  @ApiOperation({ summary: 'Create unit' })
  @ApiCreatedResponse({
    description: 'Created successfully',
    type: Unit,
  })
  createUnit(@Param('projectName') projectName: string, @Body() createUnitDto: CreateUnitDto) {
      return this.unitsService.create(projectName, createUnitDto);
  }

  @Patch(':unitName')
  @Roles(['admin', 'editor'])
  @ApiOperation({ summary: 'Update a unit by name' })
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
  @Roles(['admin', 'editor'])
  @ApiOperation({ summary: 'Delete unit by slug' })
  @ApiNoContentResponse({ description: 'Removed successfully' })
  @ApiNotFoundResponse({ description: 'No such unit' })
  @HttpCode(204)
  deleteUnit(@Param('slug') slug: string) {
    return this.unitsService.delete(slug);
  }
}
