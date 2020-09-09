/* eslint-disable @typescript-eslint/camelcase */
const uniqolor = require('uniqolor');
import { Model } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { groupBy, get, findIndex } from 'lodash';
import { sub, eachDayOfInterval, isBefore, isSameDay } from 'date-fns';
import { Project } from './interfaces/project.interface';
import {
  CreateProjectDto,
  EditProjectDto,
  GetProjectsQueryDto,
  GetMetricsQueryDto,
} from './dto/projects.dto';
import { Unit, Metrics } from 'src/units/interfaces/unit.interface';
import { Issue } from 'src/issues/interfaces/issue.interface';
import { Report } from 'src/reports/interfaces/report.interface';
import { User, Role } from 'src/users/interfaces/user.interface';
import { Template } from 'src/templates/interfaces/template.interface';
import { te } from 'date-fns/esm/locale';

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
        .populate('numIssues');
        // .populate('numTickets');

      project['numUnits'] = units.length;
      project['numUsers'] = numUsers;
      project['numIssues'] = units.reduce((total, currentValue) => {
        return total + currentValue.numIssues;
      }, 0);
      // project['numTickets'] = units.reduce((total, currentValue) => {
      //   return total + currentValue.numTickets;
      // }, 0);
    }
    return projects;
  }

  async create(project: CreateProjectDto) {
    return new this.projectModel({
      ...project,
      color: uniqolor.random().color,
    }).save();
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

  async getUnitMetrics(unit: string, days: number) {
    const reports = await this.reportModel
      .find({ unit }, '_id createdAt')
      .lean();
    const issues = await this.issueModel
      .find({ unit }, '_id status resolution createdAt closedAt risk')
      .lean()
      .populate('template', 'displayName');

    const startDate = sub(new Date(), { days });
    const interval = eachDayOfInterval({
      start: startDate,
      end: new Date(),
    });

    const created: Metrics[] = [];
    const closed: Metrics[] = [];
    const reportsVolume: Metrics[] = [];
    const openVolume: Metrics[] = [];
    const risks = new Array(5).fill(0);

    interval.forEach(day => {
      let date = day.getTime();

      created.push({
        x: date,
        y: issues.filter(issue => isSameDay(issue.createdAt.getTime(), date))
          .length,
      });

      closed.push({
        x: date,
        y: issues.filter(
          issue =>
            issue.status === 'closed' &&
            isSameDay(issue.closedAt.getTime(), date)
        ).length,
      });

      reportsVolume.push({
        x: date,
        y: reports.filter(report => isSameDay(report.createdAt.getTime(), date))
          .length,
      });
    });

    const issuesRisks = groupBy(
      issues.filter(issue => issue.resolution !== 'false positive'),
      issue => issue.risk
    );    

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

    const templates = groupBy(
      issues.filter(issue => issue.template),
      issue => (issue.template as Template).displayName
    );
    
    const labels = Object.keys(templates);
    const series = [];
    labels.forEach(label => {
      series.push(templates[label].length);
    })

    return {
      timeseries: {
        created,
        closed,
        reportsVolume,
      },
      stats: {
        risks,
      },
      templates: {
        labels,
        series,
      }
    };
  }

  async getMetrics(project: Project, options: GetMetricsQueryDto) {
    const units = await this.unitModel
      .find({ project: project._id }, '_id displayName')
      .lean();

    const unitsMetrics = [];
    const projectMetrics = {
      created: [],
      closed: [],
      risks: new Array(5).fill(0),
      reportsVolume: [],
      templates: {
        labels: [],
        series: [],
      }
    };

    if (units.length) {
      for (const unit of units) {
        const data = await this.getUnitMetrics(unit._id, parseInt(options.days));

        unitsMetrics.push({
          name: unit.displayName,
          ...data.timeseries,
          ...data.stats,
          templates: data.templates,
        });

        Object.keys(data.timeseries).forEach(key => {
          const metrics: Metrics[] = data.timeseries[key];
          metrics.forEach((metric, index) => {
            if (projectMetrics[key][index]) {
              projectMetrics[key][index].y += metric.y;
            } else {
              projectMetrics[key].push(metric);
            }
          });
        });

        Object.keys(data.stats).forEach(key => {
          const arr = data.stats[key];
          const updated = projectMetrics[key].map((a, i) => a + arr[i]);
          projectMetrics[key] = updated;
        });

        data.templates.labels.forEach((label, index) => {
          const labelIndex = projectMetrics.templates.labels.indexOf(label);
          
          if (labelIndex >= 0) {
            projectMetrics.templates.series[labelIndex] += data.templates.series[index]
          } else {
            projectMetrics.templates.labels.push(label);
            projectMetrics.templates.series.push(data.templates.series[index]);
          }
        });
      }
    }

    return {
      project: projectMetrics,
      units: unitsMetrics,
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
