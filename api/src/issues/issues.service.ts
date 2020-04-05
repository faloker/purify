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
import { SaveCommentBodyDto } from './dto/issues.dto';
import { JiraService } from 'src/plugins/jira/jira.service';

@Injectable()
export class IssuesService {
  constructor(
    @InjectModel('Issue') private readonly issueModel: Model<Issue>,
    @InjectModel('Unit') private readonly unitModel: Model<Unit>,
    @InjectModel('Comment') private readonly commentModel: Model<Comment>,
    @InjectModel('Ticket') private readonly ticketModel: Model<Ticket>,
    private jiraService: JiraService
  ) {}

  async get(unitSlug: string) {
    const unit = await this.unitModel.findOne({ slug: unitSlug });

    if (!unit) {
      throw new NotFoundException();
    }

    const issues = await this.issueModel
      .find({ unit: unit._id })
      .populate('template', [
        'title_pattern',
        'body_fields',
        'subtitle_pattern',
        'name',
      ])
      .populate('ticket')
      .populate({
        path: 'comments',
        populate: { path: 'author', select: 'username image' },
      });

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
}
