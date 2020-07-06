import {
  Injectable,
  NotFoundException,
  BadRequestException,
  NotAcceptableException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { find, forOwn, isObject } from 'lodash';
import { Template } from 'src/templates/interfaces/template.interface';
import { Unit } from 'src/units/interfaces/unit.interface';
import { Issue } from 'src/issues/interfaces/issue.interface';
import { Report } from './interfaces/report.interface';
import { xmlToJson } from 'src/utils/converter';
import { TemplatesService } from 'src/templates/templates.service';

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel('Template') private readonly templateModel: Model<Template>,
    @InjectModel('Unit') private readonly unitModel: Model<Unit>,
    @InjectModel('Issue') private readonly issueModel: Model<Issue>,
    @InjectModel('Report') private readonly reportModel: Model<Report>,
    private readonly templatesService: TemplatesService
  ) {}

  async save(file: any, unitSlug: string, templateName = '') {
    const fileName: string = file.originalname;
    const rawData: any = file.buffer.toString('utf8');

    let data = null;

    if (fileName.indexOf('.json') > -1) {
      data = JSON.parse(rawData);
    } else if (fileName.indexOf('.xml') > -1) {
      data = xmlToJson(rawData);
    } else {
      throw new NotAcceptableException('Unsupported format');
    }

    const unit = await this.unitModel.findOne({ slug: unitSlug });

    if (unit) {
      const report = await new this.reportModel({
        unit: unit._id,
        type: 'file',
        content: JSON.stringify(data),
      }).save();

      if (templateName) {
        const template = await this.templateModel.findOne({
          name: templateName,
        });

        if (template) {
          await this.templatesService.apply(report, template);
        } else {
          throw new NotFoundException('No such template');
        }
      }

      return { id: report._id };
    } else {
      throw new NotFoundException('No such unit');
    }
  }

  async saveOneshot(body: any, unitSlug: string, templateName = '') {
    const unit = await this.unitModel.findOne({ slug: unitSlug });

    if (!Object.keys(body).length) {
      throw new BadRequestException('Request body is not valid JSON');
    }

    if (unit) {
      const report = await new this.reportModel({
        unit: unit._id,
        type: 'oneshot',
        content: JSON.stringify(body),
      }).save();

      if (templateName) {
        const template = await this.templateModel.findOne({
          name: templateName,
        });

        if (template) {
          await this.templatesService.apply(report, template);
        } else {
          throw new NotFoundException('No such template');
        }
      }

      return { id: report._id };
    } else {
      throw new NotFoundException('No such unit');
    }
  }

  async delete(reportId: string) {
    const res = await this.reportModel.deleteOne({ _id: reportId });
    await this.issueModel.deleteMany({ report: reportId });

    if (res) {
      return res;
    } else {
      throw new NotFoundException();
    }
  }

  async get(unitSlug: string) {
    const unit = await this.unitModel.findOne({ slug: unitSlug });

    if (!unit) {
      throw new NotFoundException();
    } else {
      return this.reportModel
        .find({ unit: unit._id }, '-content')
        .populate('template', 'name');
    }
  }

  async getContent(reportId: string) {
    const report = await this.reportModel.findOne({ _id: reportId });

    const result = {};

    if (report.type === 'oneshot') {
      return JSON.parse(report.content);
    }

    function recur(obj, path) {
      if (Array.isArray(obj) && Object.keys(obj).length) {
        const len = Math.max(...obj.map(o => Object.keys(o).length), 0);
        result[path] = find(obj, k => Object.keys(k).length === len);
      }
      forOwn(obj, (value, key) => {
        if (Array.isArray(value) && Object.keys(value).length) {
          if (isObject(value[0])) {
            const len = Math.max(...value.map(o => Object.keys(o).length), 0);
            result[`${path}.${key}[0]`] = find(
              value,
              k => Object.keys(k).length === len
            );
          }
        } else if (isObject(value)) {
          recur(value, `${path}.${key}`);
        }
      });
    }

    recur(JSON.parse(report.content), 'root');

    return result;
  }
}
