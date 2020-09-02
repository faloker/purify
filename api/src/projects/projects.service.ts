/* eslint-disable @typescript-eslint/camelcase */
import { Model } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { groupBy, get } from 'lodash';
import * as slugify from 'slug';

import { Project } from './interfaces/project.interface';
import {
  CreateProjectDto,
  EditProjectDto,
  GetProjectsQueryDto,
} from './dto/projects.dto';
import { Unit } from 'src/units/interfaces/unit.interface';
import { Issue } from 'src/issues/interfaces/issue.interface';
import { Report } from 'src/reports/interfaces/report.interface';
import { User, Role } from 'src/users/interfaces/user.interface';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel('Project') private readonly projectModel: Model<Project>,
    @InjectModel('Unit') private readonly unitModel: Model<Unit>,
    @InjectModel('Issue') private readonly issueModel: Model<Issue>,
    @InjectModel('Report') private readonly reportModel: Model<Report>,
    @InjectModel('User') private readonly userModel: Model<User>
  ) {}

  async getAll(query: GetProjectsQueryDto, allowedProjects?: string[]) {
    const projects = await this.projectModel
      .find(allowedProjects ? { _id: { $in: allowedProjects } } : {})
      .lean();

    if (query.verbose !== 'true') {
      return projects;
    }

    for (const project of projects) {
      const numUsers = await this.userModel.countDocuments({
        $or: [
          {
            memberships: { $elemMatch: { $eq: project._id } },
          },
          {
            role: { $eq: Role.OWNER },
          },
        ],
      });
      const units = await this.unitModel
        .find({ project: project._id })
        .lean()
        .populate('numIssues')
        .populate('numTickets');

      project['numUnits'] = units.length;
      project['numUsers'] = numUsers;
      project['numIssues'] = units.reduce((total, currentValue) => {
        return total + currentValue.numIssues;
      }, 0);
      project['numTickets'] = units.reduce((total, currentValue) => {
        return total + currentValue.numTickets;
      }, 0);
    }
    return projects;
  }

  async create(project: CreateProjectDto) {
    return new this.projectModel(project).save();
  }

  async updateOne(projectId: string, editProjectDto: EditProjectDto) {
    await this.projectModel.updateOne({ _id: projectId }, editProjectDto);
    return this.projectModel.findOne({ _id: projectId }).lean();
  }

  async deleteOne(projectId: string) {
    const units = await this.unitModel
      .find({ project: projectId }, '_id')
      .lean();

    if (units.length) {
      const ids = units.map((unit: any) => unit._id);
      // update memeberships
      await this.reportModel.deleteMany({ unit: { $in: ids } });
      await this.issueModel.deleteMany({ unit: { $in: ids } });
      await this.unitModel.deleteMany({ _id: { $in: ids } });
    }

    await this.projectModel.deleteOne({ _id: projectId });
  }

  async getStatisticsForUnit(unit: string) {
    const uploadedReports = await this.reportModel
      .find({ unit }, '_id createdAt')
      .lean();
    let issues = await this.issueModel
      .find({ unit }, '_id status resolution createdAt risk')
      .lean();

    issues = issues.filter(
      issue => issue.createdAt.getFullYear() === new Date().getFullYear()
    );

    const open = new Array(12).fill(0);
    const closed = new Array(12).fill(0);
    const reports = new Array(12).fill(0);
    const risks = new Array(5).fill(0);

    const openIssues = groupBy(
      issues.filter(issue => issue.status === 'open'),
      issue => issue.createdAt.getMonth()
    );

    const reportsByDate = groupBy(uploadedReports, report =>
      report.createdAt.getMonth()
    );

    const closedIssues = groupBy(
      issues.filter(
        issue =>
          issue.status === 'closed' && issue.resolution !== 'false positive'
      ),
      issue => issue.createdAt.getMonth()
    );

    const issuesRisks = groupBy(
      issues.filter(issue => issue.resolution !== 'false positive'),
      issue => issue.risk
    );

    for (const key of Object.keys(openIssues)) {
      open[key] = get(openIssues, key).length;
    }

    for (const key of Object.keys(closedIssues)) {
      closed[key] = get(closedIssues, key).length;
    }

    for (const key of Object.keys(reportsByDate)) {
      reports[key] = get(reportsByDate, key).length;
    }

    for (const key of Object.keys(issuesRisks)) {
      switch (key) {
        case 'info':
          risks[0] = get(issuesRisks, key).length;
          break;
        case 'low':
          risks[1] = get(issuesRisks, key).length;
          break;
        case 'medium':
          risks[2] = get(issuesRisks, key).length;
          break;
        case 'high':
          risks[3] = get(issuesRisks, key).length;
          break;
        case 'critical':
          risks[4] = get(issuesRisks, key).length;
          break;
        default:
          break;
      }
    }

    return {
      open,
      closed,
      risks,
      reports,
    };
  }

  async getStats(project: Project) {
    const units = await this.unitModel
      .find({ project: project._id }, '_id displayName')
      .lean();

    const unitsStat = [];
    const projectStat = {
      open: new Array(12).fill(0),
      closed: new Array(12).fill(0),
      risks: new Array(5).fill(0),
      reports: new Array(12).fill(0),
    };

    if (units.length) {
      for (const unit of units) {
        const data = await this.getStatisticsForUnit(unit._id);

        unitsStat.push({
          name: unit.displayName,
          data,
        });

        Object.keys(data).forEach(key => {
          const arr = data[key];
          const updated = projectStat[key].map((a, i) => a + arr[i]);
          projectStat[key] = updated;
        });
      }
    }

    return {
      project: projectStat,
      units: unitsStat,
    };
  }

  async findOne(projectName: string) {
    return this.projectModel.findOne({ name: projectName }).lean();
  }

  async getUsers(project: Project) {
    return this.userModel
      .find(
        {
          $or: [
            {
              memberships: { $elemMatch: { $eq: project._id } },
            },
            {
              role: { $eq: Role.OWNER },
            },
          ],
        },
        { _id: 1, role: 1, name: 1, email: 1, image: 1 }
      )
      .lean();
  }

  async addUser(project: Project, userId: string) {
    const user = await this.userModel.findOne({ _id: userId });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.memberships.push(project._id);
    user.save();
  }

  async removeUser(project: Project, userId: string) {
    const user = await this.userModel.findOne({ _id: userId });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.memberships = user.memberships.filter(m => m !== project._id);
    user.save();
  }
}
