import { Controller, Get, Query, Post, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { IssuesService } from './issues.service';
import { GetIssuesQueryDto, UpdateIssuesBodyDto, CreateTicketBodyDto, IdParamDto, SaveCommentBodyDto } from './dto/issues.dto';
import { GenericAuthGuard } from 'src/auth/generic-auth.guard';
import { ApiTags, ApiBearerAuth, ApiSecurity } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiSecurity('api_key', ['apikey'])
@ApiTags('issues')
@Controller('issues')
@UseGuards(GenericAuthGuard)
export class IssuesController {
  constructor(private issuesService: IssuesService) {}

  @Get()
  getIssues(@Query() query: GetIssuesQueryDto) {
    return this.issuesService.get(query.unit);
  }

  @Patch()
  updateIssues(@Body() body: UpdateIssuesBodyDto) {
    return this.issuesService.updateMany(body.ids, body.change)
  }

  @Post(':id/ticket')
  createTicket(@Param('id') id: string, @Body() body: any) {
    return this.issuesService.createJiraTicket(id, body)
  }

  @Post(':id/comment')
  saveComment(@Param('id') id: string, @Body() comment: SaveCommentBodyDto) {
    return this.issuesService.saveComment(id, comment)
  }
}
