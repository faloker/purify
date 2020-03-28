import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { MongooseModule } from '@nestjs/mongoose';
import { IssueSchema } from 'src/issues/schemas/issue.schema';
import { JiraModule } from 'src/plugins/jira/jira.module';
import { UserSchema } from 'src/users/schemas/user.schema';
import { SmtpModule } from 'src/plugins/smtp/smtp.module';
import { SlackModule } from 'src/plugins/slack/slack.module';
import { CommentSchema } from 'src/issues/schemas/comment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Issue', schema: IssueSchema }]),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MongooseModule.forFeature([{ name: 'Comment', schema: CommentSchema }]),
    JiraModule,
    SmtpModule,
    SlackModule,
  ],
  providers: [TasksService]
})
export class TasksModule {}
