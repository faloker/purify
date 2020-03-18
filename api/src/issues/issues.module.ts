import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IssueSchema } from './schemas/issue.schema';
import { IssuesController } from './issues.controller';
import { IssuesService } from './issues.service';
import { UnitSchema } from 'src/units/schemas/unit.schema';
import { TicketSchema } from './schemas/ticket.schema';
import { CommentSchema } from './schemas/comment.schema';
import { JiraModule } from 'src/jira/jira.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Issue', schema: IssueSchema }]),
    MongooseModule.forFeature([{ name: 'Unit', schema: UnitSchema }]),
    MongooseModule.forFeature([{ name: 'Ticket', schema: TicketSchema }]),
    MongooseModule.forFeature([{ name: 'Comment', schema: CommentSchema }]),
    JiraModule,
  ],
  controllers: [IssuesController],
  providers: [IssuesService],
})
export class IssuesModule {}
