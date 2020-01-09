/* eslint-disable no-restricted-syntax */
import _ from 'lodash';
import boom from '@hapi/boom';
import JiraClient from 'jira-connector';
import similarity from 'string-similarity';

import Issue from '../models/Issue';
import Unit from '../models/Unit';
import Ticket from '../models/Ticket';


const fetchByUnit = async (req, reply) => {
  const unit = await Unit.findOne({ slug: req.query.unit_slug });

  if (!unit) {
    throw boom.notFound('Unable to find unit');
  }

  const docs = await Issue.find({ unit: unit._id })
    .populate('template', ['title_pattern', 'body_fields', 'subtitle_pattern', 'name'])
    .populate('ticket');
  reply.send(docs);
};

const saveIssues = async (issues, template, report) => {
  let newOnes = 0;

  let allIssuesInUnit = await Issue.find({ unit: report.unit });

  allIssuesInUnit = allIssuesInUnit
    .map((issue) => JSON.stringify(Object.values(issue.fields)));
  // allIssuesInUnit = allIssuesInUnit.map((f) => JSON.stringify(f));

  if (!allIssuesInUnit.length) allIssuesInUnit.push('');

  const allTemplateIssuesInUnit = await Issue.find({ unit: report.unit, template: template._id });

  for (const issue of issues) {
    const fieldsToCompare = template.compare_fields;
    const statistics = {};

    let issueToUpdate = {};

    if (allTemplateIssuesInUnit.length) {
      for (const field of fieldsToCompare) {
        const { bestMatch } = similarity.findBestMatch(
          _.get(issue, field),
          allTemplateIssuesInUnit.map((i) => _.get(i.fields, field)),
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
        issuesToFilter = issuesToFilter.filter((di) => _.get(di.fields, fi) === statistics[fi].target);
      }

      issueToUpdate = issuesToFilter.length ? issuesToFilter[0] : {};
    }

    if (_.isEmpty(issueToUpdate)) {
      const { bestMatch } = similarity.findBestMatch(
        JSON.stringify(Object.values(issue)),
        allIssuesInUnit,
      );

      const newIssue = await new Issue(
        {
          unit: report.unit,
          template: template._id,
          fields: issue,
          report: report._id,
          dup_score: Math.round(bestMatch.rating * 100),
        },
      ).save();
      newOnes += 1;

      allIssuesInUnit.push(JSON.stringify(Object.values(newIssue.fields)));
      allTemplateIssuesInUnit.push(newIssue);
    } else {
      for (const field of template.merge_fields) {
        let originalField = _.get(issueToUpdate.fields, field);
        const newField = _.get(issue, field);

        if (originalField) {
          if (typeof originalField === 'string'
            && !originalField.includes(newField)) {
            originalField += `\n\n${newField}`;
          } else if (_.isArray(originalField)) {
            originalField = [...new Set([...originalField, ...newField])];
          }
        }

        _.set(issueToUpdate.fields, field, originalField);
      }
      await Issue.updateOne(
        { _id: issueToUpdate._id },
        issueToUpdate,
      );
    }
  }

  return {
    new: newOnes,
    old: issues.length - newOnes,
  };
};

const updateIssues = async (req, reply) => {
  const doc = await Issue.updateMany({
    _id: { $in: req.body.ids },
  }, {
    $set: req.body.change,
  });
  reply.send(doc);
};

const updateManyIssues = async (req, reply) => {
  const doc = await Issue.updateMany({
    _id: { $in: req.body.ids },
  }, {
    $set: req.body.change,
  });
  reply.send(doc);
};

const createJiraTicket = async (req, reply) => {
  const jira = new JiraClient({
    host: process.env.JIRA_URL,
    basic_auth: {
      // eslint-disable-next-line no-use-before-define
      base64: Buffer.from(`${process.env.JIRA_USER}:${process.env.JIRA_API_KEY}`).toString('base64'),
    },
  });

  const ticket = await jira.issue.createIssue({ fields: req.body });
  // req.log.info(ticket);
  const t = await new Ticket({
    type: 'jira',
    link: `https://${process.env.JIRA_URL}/browse/${ticket.key}`,
    key: ticket.key,
  }).save();

  await Issue.updateOne({
    _id: req.params.id,
  }, {
    $set: { ticket: t._id },
  });

  reply.code(201).send(t);
};

const deleteIssue = async (req) => Issue.deleteOne({ _id: req.params.id });

export default {
  fetchByUnit,
  saveIssues,
  deleteIssue,
  updateIssues,
  createJiraTicket,
};
