import _ from 'lodash';
import boom from '@hapi/boom';

import Project from '../models/Project';
import Unit from '../models/Unit';
import Issue from '../models/Issue';
import Report from '../models/Report';

export const fetchProjects = async (req, reply) => {
  const projects = await Project.find();

  for (const project of projects) {
    const units = await Unit.find({ project: project._id }, '_id');
    const numberOfIsues = await Issue.countDocuments({ unit: { $in: units } });
    const numberOfTickets = await Issue.countDocuments({
      unit: { $in: units },
      ticket: { $exists: true },
    });
    project._doc = {
      ...project._doc,
      units: units.length,
      issues: numberOfIsues,
      tickets: numberOfTickets,
    };
  }

  reply.send(projects);
};

export const createProject = async (req, reply) => {
  const { body } = req;
  const doc = await new Project(body).save();
  reply.code(201).send(doc);
};

const getStatisticsForUnit = async unit => {
  const uploadedReports = await Report.find({ unit }, '_id created_at');
  let issues = await Issue.find(
    { unit },
    '_id is_closed is_fp created_at risk'
  );

  issues = issues.filter(
    issue => issue.created_at.getFullYear() === new Date().getFullYear()
  );

  const open = new Array(12).fill(0);
  const closed = new Array(12).fill(0);
  const reports = new Array(12).fill(0);
  const risks = new Array(5).fill(0);

  const openIssues = _.groupBy(
    issues.filter(issue => !issue.is_closed),
    issue => issue.created_at.getMonth()
  );

  const reportsByDate = _.groupBy(uploadedReports, report =>
    report.created_at.getMonth()
  );

  const closedIssues = _.groupBy(
    issues.filter(issue => issue.is_closed && !issue.is_fp),
    issue => issue.created_at.getMonth()
  );

  const issuesRisks = _.groupBy(
    issues.filter(issue => !issue.is_fp),
    issue => issue.risk
  );

  for (const key of Object.keys(openIssues)) {
    open[key] = _.get(openIssues, key).length;
  }

  for (const key of Object.keys(closedIssues)) {
    closed[key] = _.get(closedIssues, key).length;
  }

  for (const key of Object.keys(reportsByDate)) {
    reports[key] = _.get(reportsByDate, key).length;
  }

  for (const key of Object.keys(issuesRisks)) {
    switch (key) {
      case 'Info':
        risks[0] = _.get(issuesRisks, key).length;
        break;
      case 'Low':
        risks[1] = _.get(issuesRisks, key).length;
        break;
      case 'Medium':
        risks[2] = _.get(issuesRisks, key).length;
        break;
      case 'High':
        risks[3] = _.get(issuesRisks, key).length;
        break;
      case 'Critical':
        risks[4] = _.get(issuesRisks, key).length;
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
};

export const getStats = async (req, reply) => {
  const project = await Project.findOne({ slug: req.query.project });

  if (project) {
    const units = await Unit.find({ project: project._id }, '_id name');

    const unitsStat = {};
    const projectStat = {
      open: new Array(12).fill(0),
      closed: new Array(12).fill(0),
      risks: new Array(5).fill(0),
      reports: new Array(12).fill(0),
    };

    if (units.length) {
      for (const unit of units) {
        unitsStat[unit.name] = await getStatisticsForUnit(unit._id);

        for (const key of Object.keys(unitsStat[unit.name])) {
          const arr = _.get(unitsStat[unit.name], key);
          const updated = projectStat[key].map((a, i) => a + arr[i]);
          projectStat[key] = updated;
        }
      }
    }

    reply.send({
      project: projectStat,
      units: unitsStat,
    });
  } else {
    throw boom.notFound('Unable to find project');
  }
};

export const deleteProject = async (req, reply) => {
  const units = await Unit.find({ project: req.params.id }, '_id');

  if (units.length) {
    Report.deleteMany({ unit: { $in: units } });

    Issue.deleteMany({ unit: { $in: units } });

    Unit.deleteMany({ _id: { $in: units } });
  }

  const res = await Project.deleteOne({
    _id: req.params.id,
  });

  reply.send(res);
};

export const editProject = async (req, reply) => {
  const project = await Project.findOneAndUpdate(
    {
      _id: req.params.id,
    },
    {
      $set: req.body,
    }
  );

  reply.send(project);
};
