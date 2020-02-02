import _ from 'lodash';
import boom from '@hapi/boom';
import Project from '../models/Project';
import Unit from '../models/Unit';
import Issue from '../models/Issue';

export default {
  async fetchProjects(req, reply) {
    const projects = await Project.find();

    for (const project of projects) {
      const units = await Unit.find({ project: project._id }, '_id');
      const numberOfIsues = await Issue.countDocuments({ unit: { $in: units } });
      const numberOfTickets = await Issue.countDocuments(
        {
          unit: { $in: units },
          ticket: { $exists: true },
        },
      );
      project._doc = {
        ...project._doc,
        units: units.length,
        issues: numberOfIsues,
        tickets: numberOfTickets,
      };
    }

    reply.send(projects);
  },

  async createProject(req, reply) {
    const { body } = req;
    const doc = await new Project(body).save();
    reply.code(201).send(doc);
  },

  async getStats(req, reply) {
    const project = await Project.findOne({ slug: req.query.project });
    // closed issues
    // open issues
    // issues number grouped by risk
    // number of reports


    if (project) {
      const units = await Unit.find({ project: project._id }, '_id');
      let issues = await Issue.find({ unit: { $in: units } });

      const currentYear = new Date().getFullYear();

      issues = issues.filter((issue) => issue.date.getFullYear() === currentYear);

      const open = new Array(12).fill(0);
      const closed = new Array(12).fill(0);
      const risks = new Array(5).fill(0);

      const openIssues = _.groupBy(
        issues.filter((issue) => !issue.is_closed),
        (issue) => issue.date.getMonth(),
      );

      const closedIssues = _.groupBy(
        issues.filter((issue) => issue.is_closed && !issue.is_fp),
        (issue) => issue.date.getMonth(),
      );

      const issuesRisks = _.groupBy(
        issues.filter((issue) => !issue.is_fp),
        (issue) => issue.risk,
      );

      for (const key of Object.keys(openIssues)) {
        open[key] = _.get(openIssues, key).length;
      }

      for (const key of Object.keys(closedIssues)) {
        closed[key] = _.get(closedIssues, key).length;
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

      reply.send({ project: { open, closed, risks } });
    } else {
      throw boom.notFound('Unable to find project');
    }
  },
};
