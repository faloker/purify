/* eslint-disable @typescript-eslint/camelcase */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import slug = require('slug');
import { Unit } from './interfaces/unit.interface';
import { Issue } from 'src/issues/interfaces/issue.interface';
import { Report } from 'src/reports/interfaces/report.interface';
import { Project } from 'src/projects/interfaces/project.interface';
import { UnitDto } from './dto/units.dto';

@Injectable()
export class UnitsService {
  constructor(
    @InjectModel('Project') private readonly projectModel: Model<Project>,
    @InjectModel('Unit') private readonly unitModel: Model<Unit>,
    @InjectModel('Issue') private readonly issueModel: Model<Issue>,
    @InjectModel('Report') private readonly reportModel: Model<Report>,
  ) {}

  async create(unit: UnitDto) {
    const project = await this.projectModel.findOne({ slug: unit.project });

    if (project) {
      return new this.unitModel({
        name: unit.name,
        project: project._id,
        slug: `${unit.project}-${slug(unit.name)}`,
      }).save();
    } else {
      throw new NotFoundException();
    }
  }

  async delete(id: string) {
    const unit = await this.unitModel.findOne({ _id: id });

    if (!unit) {
      throw new NotFoundException();
    } else {
      await this.reportModel.deleteMany({ unit: id });
      await this.issueModel.deleteMany({ unit: id });

      return this.unitModel.deleteOne({ _id: id });
    }
  }

  async get(projectSlug: string) {
    const project = await this.projectModel.findOne({ slug: projectSlug });
  
    if (project) {
      const units = await this.unitModel.find({ project: project._id });
      const result = [];
  
      for (const unit of units) {
        const numOfReports = await this.reportModel.countDocuments({ unit: { $eq: unit } });
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
          reports: numOfReports,
          closed_tickets_len: numberOfClosedTickets,
          tickets_len: numberOfAllTickets
        })
      }
  
      return result;
    } else {
      throw new NotFoundException();
    }
  };
}
