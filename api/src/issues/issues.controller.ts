import { Controller, Get, Query, Post, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { IssuesService } from './issues.service';
import { GetIssuesQueryDto, UpdateIssuesBodyDto, CreateTicketBodyDto, IdParamDto, SaveCommentBodyDto } from './dto/issues.dto';
import { GenericAuthGuard } from 'src/auth/generic-auth.guard';

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
  createTicket(@Param() param: IdParamDto, @Body() body: CreateTicketBodyDto) {
    return this.issuesService.createJiraTicket(param.id, body.fields)
  }

  @Post(':id/comment')
  saveComment(@Param() param: IdParamDto, @Body() comment: SaveCommentBodyDto) {
    return this.issuesService.saveComment(param.id, comment)
  }
}
