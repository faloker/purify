import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { MongooseModule } from '@nestjs/mongoose';
import { IssueSchema } from 'src/issues/schemas/issue.schema';
import { JiraModule } from 'src/plugins/jira/jira.module';
import { UserSchema } from 'src/users/schemas/user.schema';
import { TicketSchema } from 'src/issues/schemas/ticket.schema';
import { SmtpModule } from 'src/plugins/smtp/smtp.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Issue', schema: IssueSchema }]),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MongooseModule.forFeature([{ name: 'Ticket', schema: TicketSchema }]),
    JiraModule,
    SmtpModule,
  ],
  providers: [TasksService]
})
export class TasksModule {}
