import _ from 'lodash';
import boom from '@hapi/boom';
import similarity from 'string-similarity';

import jira from '../plugins/jira';
import Issue from '../models/Issue';
import Unit from '../models/Unit';
import Ticket from '../models/Ticket';
import Comment from '../models/Comment';

export const fetchByUnit = async (req, reply) => {
  const unit = await Unit.findOne({ slug: req.query.unit });

  if (!unit) {
    throw boom.notFound('Unable to find unit');
  }

  const docs = await Issue.find({ unit: unit._id })
    .populate('template', [
      'title_pattern',
      'body_fields',
      'subtitle_pattern',
      'name',
    ])
    .populate('ticket')
    .populate({
      path: 'comments',
      populate: { path: 'author', select: 'username image' },
    });
  reply.send(docs);
};

export const saveIssues = async (issues, template, report) => {
  let newOnes = 0;

  let allIssuesInUnit = await Issue.find({ unit: report.unit });

  allIssuesInUnit = allIssuesInUnit.map(issue =>
    JSON.stringify(Object.values(issue.fields))
  );

  const fieldsToCompare = template.compare_fields;
  // allIssuesInUnit = allIssuesInUnit.map((f) => JSON.stringify(f));

  if (!allIssuesInUnit.length) allIssuesInUnit.push('');

  const allTemplateIssuesInUnit = await Issue.find({
    unit: report.unit,
    template: template._id,
  });

  for (const issue of issues) {
    const statistics = {};
    let issueToUpdate = {};

    if (allTemplateIssuesInUnit.length) {
      for (const field of fieldsToCompare) {
        const { bestMatch } = similarity.findBestMatch(
          _.get(issue, field),
          allTemplateIssuesInUnit.map(i => _.get(i.fields, field))
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
          di => _.get(di.fields, fi) === statistics[fi].target
        );
      }

      issueToUpdate = issuesToFilter.length ? issuesToFilter[0] : {};

      for (const field of template.merge_fields) {
        let originalField = _.get(issueToUpdate.fields, field);
        const newField = _.get(issue, field);

        if (originalField) {
          if (
            typeof originalField === 'string' &&
            !originalField.includes(newField)
          ) {
            originalField += `\n${newField}`;
          } else if (_.isArray(originalField)) {
            originalField = [...new Set([...originalField, ...newField])];
          }
        }

        _.set(issueToUpdate.fields, field, originalField);
      }
      await Issue.updateOne({ _id: issueToUpdate._id }, issueToUpdate);
    } else {
      const { bestMatch } = similarity.findBestMatch(
        JSON.stringify(Object.values(issue)),
        allIssuesInUnit
      );

      const newIssue = await new Issue({
        unit: report.unit,
        date: report.date,
        template: template._id,
        fields: issue,
        report: report._id,
        dup_score: Math.round(bestMatch.rating * 100),
      }).save();

      newOnes += 1;

      allIssuesInUnit.push(JSON.stringify(Object.values(newIssue.fields)));
      allTemplateIssuesInUnit.push(newIssue);
    }
  }

  return {
    new: newOnes,
    old: issues.length - newOnes,
  };
};

export const updateIssues = async (req, reply) => {
  const doc = await Issue.updateMany(
    {
      _id: { $in: req.body.ids },
    },
    {
      $set: req.body.change,
    }
  );
  reply.send(doc);
};

export const createJiraTicket = async (req, reply) => {
  const ticket = await jira.issue.createIssue({ fields: req.body });

  const t = await new Ticket({
    type: 'jira',
    link: `https://${process.env.JIRA_URL}/browse/${ticket.key}`,
    key: ticket.key,
  }).save();

  await Issue.updateOne({ _id: req.params.id }, { $set: { ticket: t._id } });

  reply.code(201).send(t);
};

export const deleteIssue = async (req, reply) => {
  const res = await Issue.deleteOne({ _id: req.params.id });
  reply.send(res);
};

export const postComment = async (req, reply) => {
  const comment = await new Comment(req.body).save();

  if (comment) {
    await Issue.updateOne(
      {
        _id: req.params.id,
      },
      {
        $push: { comments: comment._id },
      }
    );

    const cmt = await Comment.findOne({ _id: comment._id }).populate('author', [
      'username',
      'image',
    ]);
    reply.code(201).send(cmt);
  } else {
    boom.badData('Unable to save comment');
  }
};
