/* eslint-disable @typescript-eslint/camelcase */
import {
  Injectable,
  NotFoundException,
  NotImplementedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Issue } from './interfaces/issue.interface';
import { Unit } from 'src/units/interfaces/unit.interface';
import { Ticket } from './interfaces/ticket.interface';
import { Comment } from './interfaces/comment.interface';
import { SaveCommentBodyDto, GetIssuesQueryDto } from './dto/issues.dto';
import { JiraService } from 'src/plugins/jira/jira.service';
import { matchPattern } from 'src/utils/converter';

@Injectable()
export class IssuesService {
  constructor(
    @InjectModel('Issue') private readonly issueModel: Model<Issue>,
    @InjectModel('Unit') private readonly unitModel: Model<Unit>,
    @InjectModel('Comment') private readonly commentModel: Model<Comment>,
    @InjectModel('Ticket') private readonly ticketModel: Model<Ticket>,
    private jiraService: JiraService
  ) {}

  async get(params: GetIssuesQueryDto) {
    const unit = await this.unitModel.findOne({ slug: params.unit });
    const options: any = {};

    if (!unit) {
      throw new NotFoundException();
    } else {
      options.unit = unit._id;
    }

    if (params.status) {
      options.status = params.status;
    }

    if (params.ticket) {
      options.ticket = { $exists: params.ticket === 'true' ? true : false };
    }

    if (params.risks) {
      options.risk = { $in: params.risks.split(',').map(r => r.toLowerCase()) };
    }

    const issues: any = [];

    const rawIssues = await this.issueModel
      .find(options)
      .populate('template', ['title_pattern', 'subtitle_pattern', 'name'])
      .populate('ticket')
      .populate('comments');

    for (const issue of rawIssues) {
      issues.push({
        _id: issue._id,
        fields: JSON.parse(issue.fields),
        status: issue.status,
        resolution: issue.resolution,
        title: matchPattern(
          JSON.parse(issue.fields),
          issue.template.title_pattern
        ),
        subtitle: matchPattern(
          JSON.parse(issue.fields),
          issue.template.subtitle_pattern
        ),
        template: issue.template.name,
        risk: issue.risk,
        created_at: issue.created_at,
        ticket: issue.ticket,
        totalComments: issue.comments.length,
      });
    }

    return issues;
  }

  async updateMany(ids: string[], change: any) {
    return this.issueModel.updateMany({ _id: { $in: ids } }, { $set: change });
  }

  async createJiraTicket(issueId: string, issue: any) {
    const settings = await this.jiraService.getSettings();

    if (settings) {
      const jiraTicket = await this.jiraService
        .createIssue(issue)
        .catch(err => {
          throw new BadRequestException(JSON.stringify(JSON.parse(err).body));
        });

      const ticket = await new this.ticketModel({
        type: 'jira',
        link: `https://${settings.host}/browse/${jiraTicket.key}`,
        key: jiraTicket.key,
      }).save();

      await this.issueModel.updateOne(
        { _id: issueId },
        { $set: { ticket: ticket._id } }
      );

      return ticket;
    } else {
      throw new NotImplementedException('Jira is not configured');
    }
  }

  async saveComment(issueId: string, saveCommentBodyDto: SaveCommentBodyDto) {
    const comment = await new this.commentModel(saveCommentBodyDto).save();

    await this.issueModel.updateOne(
      { _id: issueId },
      { $push: { comments: comment._id } }
    );

    const createdComment = await this.commentModel
      .findOne({ _id: comment._id })
      .populate('author', ['username', 'image']);

    return createdComment;
  }

  async getComments(issueId: string) {
    const issue = await this.issueModel.findOne({ _id: issueId }).populate({
      path: 'comments',
      populate: { path: 'author', select: 'username image' },
    });
    return issue.comments;
  }
}
