import { Model } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { groupBy, get } from 'lodash';
import { Project } from './interfaces/project.interface';
import { ProjectDto } from './dto/projects.dto';
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
        units: units.length,
        issues: numberOfIsues,
        tickets: numberOfTickets,
      });
    }
    return result;
  }

  async create(project: ProjectDto): Promise<Project> {
    return new this.projectModel(project).save();
  }

  async edit(id: string, change: ProjectDto): Promise<Project> {
    const project = await this.projectModel.findOne({ _id: id });

    if (project) {
      project.title = change.title;
      project.subtitle = change.subtitle;
      return project.save();
    } else {
      throw new NotFoundException();
    }
  }

  async delete(id: string) {
    const project = await this.projectModel.findOne({ _id: id });

    if (!project) {
      throw new NotFoundException();
    } else {
      const units = await this.unitModel.find({ project: id }, '_id');

      if (units.length) {
        this.reportModel.deleteMany({ unit: { $in: units } });
        this.issueModel.deleteMany({ unit: { $in: units } });
        this.unitModel.deleteMany({ _id: { $in: units } });
      }

      return this.projectModel.deleteOne({ _id: id });
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

      const unitsStat = {};
      const projectStat = {
        open: new Array(12).fill(0),
        closed: new Array(12).fill(0),
        risks: new Array(5).fill(0),
        reports: new Array(12).fill(0),
      };

      if (units.length) {
        for (const unit of units) {
          unitsStat[unit.name] = await this.getStatisticsForUnit(unit._id);

          for (const key of Object.keys(unitsStat[unit.name])) {
            const arr = get(unitsStat[unit.name], key);
            const updated = projectStat[key].map((a, i) => a + arr[i]);
            projectStat[key] = updated;
          }
        }
      }

      return {
        project: projectStat,
        units: unitsStat,
      };
    } else {
      throw new NotFoundException();
    }
  }
}
