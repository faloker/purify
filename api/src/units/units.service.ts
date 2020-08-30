import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as slugify from 'slug';
import { Unit } from './interfaces/unit.interface';
import { Issue } from 'src/issues/interfaces/issue.interface';
import { Report } from 'src/reports/interfaces/report.interface';
import { CreateUnitDto, EditUnitDto } from './dto/units.dto';
import { Project } from 'src/projects/interfaces/project.interface';

@Injectable()
export class UnitsService {
  constructor(
    @InjectModel('Unit') private readonly unitModel: Model<Unit>,
    @InjectModel('Issue') private readonly issueModel: Model<Issue>,
    @InjectModel('Report') private readonly reportModel: Model<Report>,
    @InjectModel('Project') private readonly projectModel: Model<Project>
  ) {}

  async create(project: Project, createUnitDto: CreateUnitDto) {
    return new this.unitModel({
      displayName: createUnitDto.displayName,
      project: project._id,
      name: `${project.name}.${slugify(createUnitDto.displayName, {
        lower: true,
      })}`,
    }).save();
  }

  async deleteOne(unitId: string) {
    await this.reportModel.deleteMany({ unit: unitId });
    await this.issueModel.deleteMany({ unit: unitId });
    await this.unitModel.deleteOne({ _id: unitId });
  }

  async updateOne(unit: Unit, editUnitDto: EditUnitDto) {
    const project = await this.projectModel
      .findOne({ _id: unit.project as string }, 'name')
      .lean();

    await this.unitModel.updateOne(
      { _id: unit._id },
      {
        name: `${project.name}.${slugify(editUnitDto.displayName, {
          lower: true,
        })}`,
        displayName: editUnitDto.displayName,
      }
    );
    return this.unitModel.findOne({ _id: unit._id }).lean();
  }

  async getUnits(projectId: string) {
    return this.unitModel
      .find({ project: projectId })
      .lean()
      .populate('numIssues')
      .populate('numClosedIssues')
      .populate('numTickets')
      .populate('numReports');
  }

  async findOne(unitName: string) {
    return this.unitModel.findOne({ name: unitName }).lean();
  }
}
