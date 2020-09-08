import { Controller, UseGuards, Get, Query, Req, UseInterceptors } from '@nestjs/common';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { GenericAuthGuard } from 'src/auth/generic-auth.guard';
import { ApiBearerAuth, ApiSecurity, ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { EventsService } from './events.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/users/interfaces/user.interface';
import { GetEventsQueryDto } from './dto/events.dto';
import { HttpCacheInterceptor } from 'src/common/interceptors/cache.interceptor';

@UseGuards(RolesGuard)
@UseGuards(GenericAuthGuard)
@ApiBearerAuth()
@ApiSecurity('api_key', ['apikey'])
@ApiTags('events')
@Controller('events')
export class EventsController {
  constructor( private readonly eventsService: EventsService) {}


  @Get()
  @Roles(['owner', 'admin', 'user', 'observer'])
  @UseInterceptors(HttpCacheInterceptor)
  @ApiOperation({ summary: 'List events' })
  @ApiOkResponse({
    description: 'List of events',
  })
  getEvents(@Query() query: GetEventsQueryDto, @Req() req) {
    if (req.user.role !== Role.OWNER) {
      return this.eventsService.getAll(parseInt(query.days), false, req.user.memberships);
    } else {
      return this.eventsService.getAll(parseInt(query.days), true);
    }
  }
}
