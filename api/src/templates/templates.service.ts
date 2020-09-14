import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { get, isArray, set } from 'lodash';
import { Model } from 'mongoose';
import * as slugify from 'slug';

import { Report, ReportType } from 'src/reports/interfaces/report.interface';
import { Template } from './interfaces/template.interface';
import {
  CreateTemplateDto,
  EditTemplateDto,
  GetTemplatesQueryDto,
} from './dto/templates.dto';
import { Issue } from 'src/issues/interfaces/issue.interface';
import { SlackService } from 'src/plugins/slack/slack.service';
import { Unit } from 'src/units/interfaces/unit.interface';

@Injectable()
export class TemplatesService {
  constructor(
    @InjectModel('Report') private readonly reportModel: Model<Report>,
    @InjectModel('Template') private readonly templateModel: Model<Template>,
    @InjectModel('Unit') private readonly unitsModel: Model<Unit>,
    @InjectModel('Issue') private readonly issueModel: Model<Issue>,
    private readonly slackService: SlackService,
    private readonly configService: ConfigService
  ) {}

  async save(createTemplateDto: CreateTemplateDto) {
    const template = await new this.templateModel(createTemplateDto).save();
    const report = await this.reportModel
      .findOne({
        _id: createTemplateDto.report,
      })
      .lean();

    await this.apply(report, template);

    return template;
  }

  async apply(report: any, template: any) {
    const content = JSON.parse(report.content);
    let issues: any = [];

    if (report.type === ReportType.ONESHOT) {
      issues = [content];
    } else {
      issues =
        template.pathToIssues !== ''
          ? get(content, template.pathToIssues)
          : content;
    }

    const stat = await this.saveIssues(issues, template, report);

    return this.reportModel.updateOne(
      { _id: report._id },
      { statistics: stat, template: template._id }
    );
  }

  async saveIssues(issues: object[], template: Template, report: Report) {
    let newOnes = 0;

    const allIssuesInUnit = await this.issueModel
      .find({ unit: report.unit })
      .lean();
    const allTemplateIssuesInUnit = await this.issueModel
      .find({
        unit: report.unit,
        template: template._id,
      })
      .lean();

    for (const issue of issues) {
      // Do external comparison first to avoid duplicate issues between templates
      let filteredUnitIssues = allIssuesInUnit;
      for (const comparisonField of template.externalComparisonFields) {
        filteredUnitIssues = filteredUnitIssues.filter((existingIssue) =>
          existingIssue.fields
            .toLowerCase()
            .includes(get(issue, comparisonField).toLowerCase())
        );
      }

      // There are no issues similar to the new one in the unit, move to the template comparison
      if (filteredUnitIssues.length === 0) {
        let filteredTemplateIssues = allTemplateIssuesInUnit;
        for (const comparisonField of template.internalComparisonFields) {
          filteredTemplateIssues = filteredTemplateIssues.filter(
            (existingIssue) =>
              get(JSON.parse(existingIssue.fields), comparisonField) ===
              get(issue, comparisonField)
          );
        }

        // There is an issue similar to the new one
        if (filteredTemplateIssues.length && template.mergeFields.length) {
          const issueToUpdate = filteredTemplateIssues[0];
          const oldIssue = JSON.parse(issueToUpdate.fields);

          for (const field of template.mergeFields) {
            let originalField = get(oldIssue, field);
            const newField = get(issue, field);

            if (originalField) {
              if (
                typeof originalField === 'string' &&
                !originalField.toLowerCase().includes(newField.toLowerCase())
              ) {
                originalField += `\n${newField}`;
              } else if (isArray(originalField)) {
                originalField = [...new Set([...originalField, ...newField])];
              }
            }

            set(oldIssue, field, originalField);
          }

          await this.issueModel.updateOne(
            { _id: issueToUpdate._id },
            { $set: { fields: JSON.stringify(oldIssue) } }
          );
        } else {
          let risk = get(issue, template.riskField, '').toLowerCase();

          if (['negligible', 'informative'].includes(risk)) {
            risk = 'info';
          }

          const newIssue = await new this.issueModel({
            unit: report.unit,
            project: report.project,
            risk: ['low', 'medium', 'high', 'critical', 'info'].includes(risk)
              ? risk
              : 'medium',
            template: template._id,
            fields: JSON.stringify(issue),
            report: report._id,
          }).save();

          newOnes += 1;
          allTemplateIssuesInUnit.push(newIssue);
          allIssuesInUnit.push(newIssue);
        }
      }
    }

    if (newOnes > 0) {
      const unit = await this.unitsModel.findOne({ _id: report.unit }).lean();
      await this.slackService.sendMsg(
        `🆕 You have *${newOnes}* new issues\n📄 Template: ${
          template.displayName
        }\n🗃️ Unit: ${
          unit.displayName
        }\n👀 Take a look at them <https://${this.configService.get<string>(
          'DOMAIN'
        )}/#/unit/${unit.name}/issues|*here*>`
      );
    }

    return {
      new: newOnes,
      old: issues.length - newOnes,
    };
  }

  async findAll(params: GetTemplatesQueryDto) {
    if (params.verbose) {
      return this.templateModel
        .find()
        .lean()
        .populate('numIssues')
        .populate('numReports');
    } else {
      return this.templateModel.find().lean();
    }
  }

  async updateOne(name: string, template: EditTemplateDto) {
    const oldTemplate = await this.templateModel
      .findOne({ name }, '_id')
      .lean();

    if (oldTemplate) {
      await this.templateModel.updateOne({ name }, template);
      return this.templateModel.findOne({ name }).lean();
    } else {
      throw new NotFoundException('Template not found');
    }
  }

  async deleteOne(name: string) {
    const template = await this.templateModel.findOne({ name }).lean();

    if (template) {
      await this.issueModel.updateMany(
        { template: template._id },
        { $unset: { template: '' } }
      );
      await this.reportModel.updateMany(
        { template: template._id },
        { $unset: { template: '' } }
      );
      await this.templateModel.deleteOne({ name });
    } else {
      throw new NotFoundException('Template not found');
    }
  }
}
