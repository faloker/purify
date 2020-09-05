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
import { Project } from 'src/projects/interfaces/project.interface';
import { Template } from 'src/templates/interfaces/template.interface';

@Injectable()
export class IssuesService {
  constructor(
    @InjectModel('Issue') private readonly issueModel: Model<Issue>,
    @InjectModel('Unit') private readonly unitModel: Model<Unit>,
    @InjectModel('Comment') private readonly commentModel: Model<Comment>,
    @InjectModel('Ticket') private readonly ticketModel: Model<Ticket>,
    @InjectModel('Project') private readonly projectModel: Model<Project>,
    private jiraService: JiraService
  ) {}

  async getIssues(params: GetIssuesQueryDto, allowedProjects?: string[]) {
    const options: any = {};

    if (params.status) {
      options.status = params.status;
    }
    if (params.ticket) {
      options.ticket = { $exists: params.ticket === 'true' ? true : false };
    }
    if (params.risks) {
      options.risk = { $in: params.risks.split(',').map(r => r.toLowerCase()) };
    }
    if (params.unitName) {
      const { _id } = await this.unitModel
        .findOne({ name: params.unitName }, '_id')
        .lean();
      if (_id) {
        options.unit = _id;
      } else {
        throw new NotFoundException('Unit not found');
      }
    }
    if (params.projectName) {
      const { _id } = await this.projectModel
        .findOne({ name: params.projectName }, '_id')
        .lean();
      if (_id) {
        options.project = _id;
      } else {
        throw new NotFoundException('Project not found');
      }
    } else if (allowedProjects) {
      options.project = { $in: allowedProjects };
    }

    const issues: any = [];

    const rawIssues = await this.issueModel
      .find(options)
      .lean()
      .populate('template', ['titlePattern', 'subtitlePattern', 'displayName'])
      .populate('ticket')
      .populate('comments');

    for (const issue of rawIssues) {
      const fieldsAsObject = JSON.parse(issue.fields);
      if (issue.template) {
        issues.push({
          _id: issue._id,
          fields: fieldsAsObject,
          status: issue.status,
          resolution: issue.resolution,
          title: matchPattern(
            fieldsAsObject,
            (issue.template as Template).titlePattern
          ),
          subtitle: matchPattern(
            fieldsAsObject,
            (issue.template as Template).subtitlePattern
          ),
          template: (issue.template as Template).displayName,
          risk: issue.risk,
          createdAt: issue.createdAt,
          updatedAt: issue.updatedAt,
          ticket: issue.ticket,
          totalComments: issue.comments.length,
        });
      }
    }

    return issues;
  }

  async updateMany(ids: string[], change: any, allowedProjects?: string[]) {
    const options: any = { _id: { $in: ids } };
    const payload: any = { $set: change };

    if (allowedProjects) {
      options.project = { $in: allowedProjects };
    }

    if (change.status === 'closed') {
      payload.$set.closedAt = new Date();
    } else if (change.status === 'open') {
      payload.$unset = {};
      payload.$unset.closedAt = '';
    }

    return this.issueModel.updateMany(options, payload);
  }

  async createJiraTicket(issueId: string, jiraIssue: any) {
    const settings = await this.jiraService.getSettings();
    if (settings) {
      const jiraTicket = await this.jiraService
        .createIssue(jiraIssue)
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

    return this.commentModel
      .findOne({ _id: comment._id })
      .lean()
      .populate('author', ['name', 'image']);
  }

  async getComments(issueId: string, allowedProjects?: string[]) {
    const issue = await this.issueModel
      .findOne({ _id: issueId })
      .lean()
      .populate({
        path: 'comments',
        populate: { path: 'author', select: 'name image' },
      });
    return issue.comments;
  }

  async findOne(issueId: string) {
    return this.issueModel.findOne({ _id: issueId }).lean();
  }
}
