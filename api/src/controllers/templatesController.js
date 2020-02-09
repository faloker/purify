import _ from 'lodash';

import { saveIssues } from './issuesController';
import Template from '../models/Template';
import Report from '../models/Report';

export const applyTemplate = async (report, template) => {
  const rep = report;
  const issues =
    template.path_to_issues !== ''
      ? _.get(report.content, template.path_to_issues)
      : report.content;
  const stat = await saveIssues(issues, template, report);

  rep.statistics = stat;
  rep.template = template._id;

  rep.save();
};

export const saveTemplate = async (req, reply) => {
  const template = await new Template(req.body).save({ checkKeys: false });
  const report = await Report.findOne({ _id: req.body.report });

  await applyTemplate(report, template);

  reply.code(201).send(template);
};

export const fetchTemplatesNames = async (req, reply) => {
  const allTemplates = await Template.find({}, 'name tags');
  const res = {
    names: [],
    tags: [],
  };

  for (const template of allTemplates) {
    res.names.push(template.name);
    res.tags = [...res.tags, ...template.tags];
  }

  res.names = [...new Set(res.names)];
  res.tags = [...new Set(res.tags)];

  return res;
};
