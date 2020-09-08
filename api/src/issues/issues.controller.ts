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
  IdParamDto,
} from './dto/issues.dto';
import { GenericAuthGuard } from 'src/auth/generic-auth.guard';
import {
  ApiTags,
  ApiBearerAuth,
  ApiSecurity,
  ApiOperation,
  ApiParam,
  ApiOkResponse,
} from '@nestjs/swagger';
import { RolesGuard } from 'src/common/guards/roles.guard';

import { Roles } from 'src/common/decorators/roles.decorator';
import { Unit } from 'src/units/interfaces/unit.interface';
import { UnitInterceptor } from 'src/common/interceptors/unit.interceptor';
import { Role } from 'src/users/interfaces/user.interface';
import { IssueInterceptor } from 'src/common/interceptors/issue.interceptor';
import { Issue } from './interfaces/issue.interface';

@UseGuards(RolesGuard)
@UseGuards(GenericAuthGuard)
@ApiBearerAuth()
@ApiSecurity('api_key', ['apikey'])
@ApiTags('issues')
@Controller('issues')
export class IssuesController {
  constructor(private issuesService: IssuesService) {}

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
  updateIssues(@Body() body: UpdateIssuesBodyDto, @Req() req) {
    if (req.user.role !== Role.OWNER) {
      return this.issuesService.updateMany(
        body.ids,
        body.change,
        req.user.memberships
      );
    } else {
      return this.issuesService.updateMany(body.ids, body.change);
    }
  }

  @Post(':id/ticket')
  @Roles(['owner', 'admin', 'user'])
  @UseInterceptors(IssueInterceptor)
  createTicket(@Param('id') issue: Issue, @Body() body: any) {
    return this.issuesService.createJiraTicket(issue._id, body);
  }

  @Post(':id/comments')
  @Roles(['owner', 'admin', 'user'])
  @UseInterceptors(IssueInterceptor)
  saveComment(@Param('id') issue: Issue, @Body() comment: SaveCommentBodyDto) {
    return this.issuesService.saveComment(issue._id, comment);
  }

  @Get(':id/comments')
  @Roles(['owner', 'admin', 'user', 'observer'])
  @UseInterceptors(IssueInterceptor)
  getComments(@Param('id') issue: Issue) {
    return this.issuesService.getComments(issue._id);
  }
}
