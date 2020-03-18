/* eslint-disable @typescript-eslint/camelcase */
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { sub } from 'date-fns';
import { Model } from 'mongoose';
import { Issue } from 'src/issues/interfaces/issue.interface';
import { JiraService } from 'src/jira/jira.service';
import { User } from 'src/users/interfaces/user.interface';
import { Ticket } from 'src/issues/interfaces/ticket.interface';
import { SmtpService } from 'src/smtp/smtp.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel('Issue') private readonly issueModel: Model<Issue>,
    @InjectModel('User') private readonly userModel: Model<User>,
    @InjectModel('Ticket') private readonly ticketModel: Model<Ticket>,
    private jiraService: JiraService,
    private smtpService: SmtpService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_10AM)
  async dailyReport() {
    const issues = await this.issueModel.find({
      is_closed: false,
      created_at: { $gt: sub(new Date(), { hours: 24 }) },
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
    const issues = await this.issueModel
      .find({ ticket: { $exists: true } })
      .populate('ticket');

    for (const issue of issues) {
      const { fields } = await this.jiraService.getIssue(issue.ticket.key);

      if (
        fields.resolution &&
        fields.resolution.name === 'Done' &&
        !issue.is_closed
      ) {
        const user = await this.userModel.findOne({ username: 'purify' });

        const comment = await new this.ticketModel({
          author: user._id,
          text: 'Resolved in Jira with resolution Done',
          date: Date.now(),
        }).save();

        await this.issueModel.updateOne(
          { _id: issue._id },
          {
            $push: { comments: comment._id },
            is_closed: true,
          },
        );
      }
    }
  }
}
