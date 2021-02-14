/* eslint-disable @typescript-eslint/camelcase */
/* istanbul ignore file */

import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { sub } from 'date-fns';
import { Model } from 'mongoose';
import { Issue } from 'src/issues/interfaces/issue.interface';
import { JiraService } from 'src/plugins/jira/jira.service';
import { User } from 'src/users/interfaces/user.interface';
import { Comment } from 'src/issues/interfaces/comment.interface';
import { SmtpService } from 'src/plugins/smtp/smtp.service';
import { SlackService } from 'src/plugins/slack/slack.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel('Issue') private readonly issueModel: Model<Issue>,
    @InjectModel('User') private readonly userModel: Model<User>,
    @InjectModel('Comment') private readonly commentModel: Model<Comment>,
    private jiraService: JiraService,
    private smtpService: SmtpService,
    private slackService: SlackService
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_10AM)
  async dailyReport() {
    const issues = await this.issueModel.find({
      status: 'open',
      createdAt: { $gt: sub(new Date(), { hours: 24 }) },
    });

    // this.smtpService.send(
    //   ['your@ma.il'],
    //   'pur@pur.com',
    //   'Heads Up | Purify Report',
    //   `You have ${issues.length || 0} new issues.`,
    // );
  }

  @Cron(CronExpression.EVERY_HOUR)
  async syncTickets() {
    const jira = await this.jiraService.getJiraClient();

    if (!jira) {
      return null;
    }

    const issues = await this.issueModel
      .find({ ticket: { $exists: true } })
      .populate('ticket');

    for (const issue of issues) {
      // @ts-ignore
      const { fields } = await this.jiraService.getIssue(issue.ticket.key);

      if (
        fields.resolution &&
        fields.resolution.name === 'Done' &&
        issue.status === 'open'
      ) {
        const user = await this.userModel.findOne({ username: 'purify' });

        const comment = await new this.commentModel({
          author: user._id,
          text: 'Resolved in Jira with a resolution equal to Done',
        }).save();

        await this.slackService.sendMsg(
          // @ts-ignore
          `✅ Issue <${issue.ticket.link}|*${issue.ticket.key}*> was resolved in Jira with a resolution equal to *Done*!`
        );

        await this.issueModel.updateOne(
          { _id: issue._id },
          {
            $push: { comments: comment._id },
            status: 'closed',
          }
        );
      }
    }
  }
}
