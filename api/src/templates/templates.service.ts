import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { findBestMatch } from 'string-similarity';
import { get, isArray, set } from 'lodash';
import { Model } from 'mongoose';
import { Report } from 'src/reports/interfaces/report.interface';
import { Template } from './interfaces/template.interface';
import { IdParamDto, SaveTemplateDto, EditTemplateBodyDto } from './dto/templates.dto';
import { Issue } from 'src/issues/interfaces/issue.interface';

@Injectable()
export class TemplatesService {
  constructor(
    @InjectModel('Report') private readonly reportModel: Model<Report>,
    @InjectModel('Template') private readonly templateModel: Model<Template>,
    @InjectModel('Issue') private readonly issueModel: Model<Issue>,
  ) {}

  async save(saveTemplateDto: SaveTemplateDto) {
    const template = await new this.templateModel(saveTemplateDto).save();
    const report = await this.reportModel.findOne({
      _id: saveTemplateDto.report,
    });

    await this.apply(report, template);

    return { id: template._id };
  }

  async apply(report: Report, template: Template) {
    const rep = report;
    const issues =
      template.path_to_issues !== ''
        ? get(report.content, template.path_to_issues)
        : report.content;

    const stat = await this.saveIssues(issues, template, report);

    rep.statistics = stat;
    rep.template = template._id;

    return rep.save();
  }

  async saveIssues(issues: object[], template: Template, report: Report) {
    let newOnes = 0;

    const allIssuesInUnit = await this.issueModel.find({ unit: report.unit });

    const issuesStringRepresentation = allIssuesInUnit.map(issue =>
      JSON.stringify(Object.values(issue.fields)),
    );

    const fieldsToCompare = template.compare_fields;
    // allIssuesInUnit = allIssuesInUnit.map((f) => JSON.stringify(f));

    if (!issuesStringRepresentation.length) issuesStringRepresentation.push('');

    const allTemplateIssuesInUnit = await this.issueModel.find({
      unit: report.unit,
      template: template._id,
    });

    for (const issue of issues) {
      const statistics = {};
      let issueToUpdate: any = {};

      if (allTemplateIssuesInUnit.length) {
        for (const field of fieldsToCompare) {
          const { bestMatch } = findBestMatch(
            get(issue, field),
            allTemplateIssuesInUnit.map(i => get(i.fields, field)),
          );

          bestMatch.rating *= 100;

          if (bestMatch.rating > 95) {
            statistics[field] = bestMatch;
          }
        }
      }

      if (Object.keys(statistics).length === fieldsToCompare.length) {
        let issuesToFilter = allTemplateIssuesInUnit;

        for (const fi of Object.keys(statistics)) {
          issuesToFilter = issuesToFilter.filter(
            di => get(di.fields, fi) === statistics[fi].target,
          );
        }

        issueToUpdate = issuesToFilter.length ? issuesToFilter[0] : {};

        for (const field of template.merge_fields) {
          let originalField = get(issueToUpdate.fields, field);
          const newField = get(issue, field);

          if (originalField) {
            if (
              typeof originalField === 'string' &&
              !originalField.includes(newField)
            ) {
              originalField += `\n${newField}`;
            } else if (isArray(originalField)) {
              originalField = [...new Set([...originalField, ...newField])];
            }
          }

          set(issueToUpdate.fields, field, originalField);
        }
        await this.issueModel.updateOne(
          { _id: issueToUpdate._id },
          issueToUpdate,
        );
      } else {
        const { bestMatch } = findBestMatch(
          JSON.stringify(Object.values(issue)),
          issuesStringRepresentation,
        );

        const newIssue = await new this.issueModel({
          unit: report.unit,
          template: template._id,
          fields: issue,
          report: report._id,
          // eslint-disable-next-line @typescript-eslint/camelcase
          dup_score: Math.round(bestMatch.rating * 100),
        }).save();

        newOnes += 1;

        issuesStringRepresentation.push(
          JSON.stringify(Object.values(newIssue.fields)),
        );
        allTemplateIssuesInUnit.push(newIssue);
      }
    }

    return {
      new: newOnes,
      old: issues.length - newOnes,
    };
  }
  
  async findAll() {
    const templates = await this.templateModel.find();
    const result = [];

    for (const template of templates) {
      const numberOfIsues = await this.issueModel.countDocuments({
        template: template._id,
      });
      const numberOfReports = await this.reportModel.countDocuments({
        template: template._id,
      });

      result.push({
        template,
        issues: numberOfIsues,
        reports: numberOfReports,
      });
    }

    return result;
  }

  async updateOne(templateId: string, template: EditTemplateBodyDto) {
    const oldTemplate = await this.templateModel.findOne({ _id: templateId });
    if (oldTemplate) {
      return this.templateModel.updateOne({ _id: templateId }, template);
    } else {
      throw new NotFoundException();
    }
  }

  async deleteOne() {
    throw new Error('Not implemented');
  }
}
