/* eslint-disable @typescript-eslint/camelcase */
import { Model } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { groupBy, get } from 'lodash';
import * as slugify from 'slug';

import { Project } from './interfaces/project.interface';
import { CreateProjectDto, EditProjectDto } from './dto/projects.dto';
import { Unit } from 'src/units/interfaces/unit.interface';
import { Issue } from 'src/issues/interfaces/issue.interface';
import { Report } from 'src/reports/interfaces/report.interface';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel('Project') private readonly projectModel: Model<Project>,
    @InjectModel('Unit') private readonly unitModel: Model<Unit>,
    @InjectModel('Issue') private readonly issueModel: Model<Issue>,
    @InjectModel('Report') private readonly reportModel: Model<Report>
  ) {}

  async getAll() {
    const projects = await this.projectModel.find();
    const result = [];

    for (const project of projects) {
      const units = await this.unitModel.find({ project: project._id }, '_id');
      const numberOfIsues = await this.issueModel.countDocuments({
        unit: { $in: units },
      });
      const numberOfTickets = await this.issueModel.countDocuments({
        unit: { $in: units },
        ticket: { $exists: true },
      });

      result.push({
        _id: project._id,
        title: project.title,
        subtitle: project.subtitle,
        slug: project.slug,
        created_at: project.created_at,
        updated_at: project.updated_at,
        units: units.length,
        issues: numberOfIsues,
        tickets: numberOfTickets,
      });
    }
    return result;
  }

  async create(project: CreateProjectDto) {
    return new this.projectModel(project).save();
  }

  async edit(slug: string, fields: EditProjectDto) {
    const project = await this.projectModel.findOne({ slug });
    const change: any = fields;

    if (project) {
      if (project.title !== fields.title) {
        change.slug = slugify(fields.title);
      }

      await this.projectModel.updateOne({ slug }, change);
      return this.projectModel.findOne({ slug });
    } else {
      throw new NotFoundException('No such project');
    }
  }

  async delete(slug: string) {
    const project = await this.projectModel.findOne({ slug });

    if (project) {
      const units = await this.unitModel.find({ project: project._id }, '_id');

      if (units.length) {
        // @ts-ignore
        this.reportModel.deleteMany({ unit: { $in: units } });
        this.issueModel.deleteMany({ unit: { $in: units } });
        // @ts-ignore
        this.unitModel.deleteMany({ _id: { $in: units } });
      }

      await this.projectModel.deleteOne({ slug });
    } else {
      throw new NotFoundException('No such project');
    }
  }

  async getStatisticsForUnit(unit: string) {
    const uploadedReports = await this.reportModel.find(
      { unit },
      '_id created_at'
    );
    let issues = await this.issueModel.find(
      { unit },
      '_id status resolution created_at risk'
    );

    issues = issues.filter(
      issue => issue.created_at.getFullYear() === new Date().getFullYear()
    );

    const open = new Array(12).fill(0);
    const closed = new Array(12).fill(0);
    const reports = new Array(12).fill(0);
    const risks = new Array(5).fill(0);

    const openIssues = groupBy(
      issues.filter(issue => issue.status === 'open'),
      issue => issue.created_at.getMonth()
    );

    const reportsByDate = groupBy(uploadedReports, report =>
      report.created_at.getMonth()
    );

    const closedIssues = groupBy(
      issues.filter(
        issue =>
          issue.status === 'closed' && issue.resolution !== 'false positive'
      ),
      issue => issue.created_at.getMonth()
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

  async getStats(slug: string) {
    const project = await this.projectModel.findOne({ slug });

    if (project) {
      const units = await this.unitModel.find(
        { project: project._id },
        '_id name'
      );

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
            name: unit.name,
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
    } else {
      throw new NotFoundException('No such project');
    }
  }

  async getUnits(slug: string) {
    const project = await this.projectModel.findOne({ slug });

    if (project) {
      const units = await this.unitModel.find({ project: project._id });
      const result = [];

      for (const unit of units) {
        // @ts-ignore
        const numOfReports = await this.reportModel.countDocuments({
          unit: { $eq: unit },
        });
        const numberOfClosedTickets = await this.issueModel.countDocuments({
          unit: { $eq: unit },
          status: 'closed',
        });
        const numberOfAllTickets = await this.issueModel.countDocuments({
          unit: { $eq: unit },
        });

        result.push({
          _id: unit._id,
          name: unit.name,
          slug: unit.slug,
          project: unit.project,
          created_at: unit.created_at,
          updated_at: unit.updated_at,
          reports: numOfReports,
          closed_tickets: numberOfClosedTickets,
          tickets: numberOfAllTickets,
        });
      }

      return result;
    } else {
      throw new NotFoundException('No such project');
    }
  }
}
