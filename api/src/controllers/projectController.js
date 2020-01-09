import _ from 'lodash';
import Project from '../models/Project';
import Unit from '../models/Unit';
import Issue from '../models/Issue';

const fetchProjects = async (req, reply) => {
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
};

const createProject = async (req, reply) => {
  const { body } = req;
  const doc = await new Project(body).save();
  reply.code(201).send(doc);
};

const getProject = async (req) => Project.findOne({ slug: req.params.slug });

export default {
  fetchProjects,
  getProject,
  createProject,
};
