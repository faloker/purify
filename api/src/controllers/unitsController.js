import boom from '@hapi/boom';
import slug from 'slug';

import Unit from '../models/Unit';
import Project from '../models/Project';
import Report from '../models/Report';
import Issue from '../models/Issue';

export const createUnit = async (req, reply) => {
  const { body } = req;

  const project = await Project.findOne({ slug: body.project });
  body.slug = `${body.project}-${slug(body.name)}`;
  body.project = project._id;
  const doc = await new Unit(body).save();

  reply.code(201).send(doc);
};

export const getUnitsByProjectSlug = async (req, reply) => {
  const project = await Project.findOne({ slug: req.query.project });

  if (project) {
    const units = await Unit.find({ project: project._id });

    for (const unit of units) {
      const numOfReports = await Report.countDocuments({ unit: { $eq: unit } });
      const numberOfClosedTickets = await Issue.countDocuments({
        unit: { $eq: unit },
        is_closed: true,
      });
      const numberOfAllTickets = await Issue.countDocuments({
        unit: { $eq: unit },
      });

      unit._doc.reports = numOfReports;
      unit._doc.closed_tickets_len = numberOfClosedTickets;
      unit._doc.tickets_len = numberOfAllTickets;
    }

    reply.send(units);
  } else {
    throw boom.notFound('Unable to find project');
  }
};

export const editUnit = async (req, reply) => {
  const doc = await Unit.findOneAndUpdate(
    {
      _id: req.params.id,
    },
    {
      $set: req.body.change,
    }
  );
  reply.send(doc);
};

export const deleteUnit = async (req, reply) => {
  await Report.deleteMany({ unit: req.params.id });

  await Issue.deleteMany({ unit: req.params.id });

  const stat = await Unit.deleteOne({ _id: req.params.id });

  reply.send(stat);
};
