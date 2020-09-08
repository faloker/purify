import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IssueSchema } from './schemas/issue.schema';
import { IssuesController } from './issues.controller';
import { IssuesService } from './issues.service';
import { UnitSchema } from 'src/units/schemas/unit.schema';
import { TicketSchema } from './schemas/ticket.schema';
import { CommentSchema } from './schemas/comment.schema';
import { JiraModule } from 'src/plugins/jira/jira.module';
import { UnitsModule } from 'src/units/units.module';
import { ProjectsModule } from 'src/projects/projects.module';
import { ProjectSchema } from 'src/projects/schemas/project.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Issue', schema: IssueSchema },
      { name: 'Unit', schema: UnitSchema },
      { name: 'Ticket', schema: TicketSchema },
      { name: 'Comment', schema: CommentSchema },
      { name: 'Project', schema: ProjectSchema },
    ]),
    JiraModule,
    ProjectsModule,
    UnitsModule,
  ],
  controllers: [IssuesController],
  providers: [IssuesService],
})
export class IssuesModule {}
