import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  UseInterceptors,
  Req,
} from '@nestjs/common';
import { IssuesService } from './issues.service';
import {
  GetIssuesQueryDto,
  UpdateIssuesBodyDto,
  SaveCommentBodyDto,
} from './dto/issues.dto';
import { GenericAuthGuard } from 'src/auth/generic-auth.guard';
import {
  ApiTags,
  ApiBearerAuth,
  ApiSecurity,
  ApiOperation,
  ApiOkResponse,
} from '@nestjs/swagger';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/users/interfaces/user.interface';
import { IssueInterceptor } from 'src/common/interceptors/issue.interceptor';
import { Issue } from './interfaces/issue.interface';
import { EventsService } from 'src/events/events.service';
import { EventType, Audience } from 'src/events/interfaces/event.interface';

@UseGuards(RolesGuard)
@UseGuards(GenericAuthGuard)
@ApiBearerAuth()
@ApiSecurity('api_key', ['apikey'])
@ApiTags('issues')
@Controller('issues')
export class IssuesController {
  constructor(
    private issuesService: IssuesService,
    private readonly eventsService: EventsService
  ) {}

  @Get()
  @Roles(['owner', 'admin', 'user', 'observer'])
  @ApiOperation({ summary: 'List issues' })
  @ApiOkResponse({ description: 'List of issues' })
  @ApiTags('issues')
  getIssues(@Query() query: GetIssuesQueryDto, @Req() req) {
    if (req.user.role !== Role.OWNER) {
      return this.issuesService.getIssues(query, req.user.memberships);
    } else {
      return this.issuesService.getIssues(query);
    }
  }

  @Patch()
  @Roles(['owner', 'admin', 'user'])
  async updateIssues(@Body() body: UpdateIssuesBodyDto, @Req() req) {
    let res: any = {};
    if (req.user.role !== Role.OWNER) {
      res = await this.issuesService.updateMany(
        body.ids,
        body.change,
        req.user.memberships
      );
    } else {
      res = await this.issuesService.updateMany(body.ids, body.change);
    }

    if (body.change.status === 'closed') {
      body.ids.forEach(async (id) => {
        const issue = await this.issuesService.enrichOne(id);
        if (issue) {
          await this.eventsService.add(
            EventType.ISSUE_RESOLVED,
            { ...issue },
            req.user._id,
            Audience.ALL
          );
        }
      })
    }

    return res;
  }

  @Post(':id/ticket')
  @Roles(['owner', 'admin', 'user'])
  @UseInterceptors(IssueInterceptor)
  async createTicket(@Param('id') issue: Issue, @Body() body: any, @Req() req) {
    const ticket = await this.issuesService.createJiraTicket(issue._id, body);
    const doc = await this.issuesService.enrichOne(issue._id);
    await this.eventsService.add(
      EventType.TICKET_CREATED,
      { link: ticket.link, key: ticket.key, ...doc },
      req.user._id,
      Audience.ALL
    );
    return ticket;
  }

  @Post(':id/comments')
  @Roles(['owner', 'admin', 'user'])
  @UseInterceptors(IssueInterceptor)
  async saveComment(
    @Param('id') issue: Issue,
    @Body() comment: SaveCommentBodyDto,
    @Req() req
  ) {
    const com = await this.issuesService.saveComment(issue._id, comment);
    const doc = await this.issuesService.enrichOne(issue._id);
    await this.eventsService.add(
      EventType.COMMENT_CREATED,
      { text: com.text, ...doc },
      req.user._id,
      Audience.ALL
    );
    return com;
  }

  @Get(':id/comments')
  @Roles(['owner', 'admin', 'user', 'observer'])
  @UseInterceptors(IssueInterceptor)
  getComments(@Param('id') issue: Issue) {
    return this.issuesService.getComments(issue._id);
  }
}
