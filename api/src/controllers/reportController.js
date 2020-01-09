/* eslint-disable prefer-destructuring */
import boom from '@hapi/boom';
import _ from 'lodash';

import Report from '../models/Report';
import Template from '../models/Template';
import Unit from '../models/Unit';
import templateController from './templateController';
import { xmlToJson } from '../utils';

const saveReport = async (req, reply) => {
  const { file, unit } = req.body;
  const fileName = file.name;
  const rawData = file.data.toString('utf8');

  let data = null;

  // Detect and parse what we got based on the file extension
  if (fileName.indexOf('.json') > -1) {
    data = JSON.parse(rawData);
  } else if (fileName.indexOf('.xml') > -1) {
    data = xmlToJson(rawData);
  } else {
    throw boom.notAcceptable('Not supported format');
  }

  const u = await Unit.findOne({ slug: unit });
  if (u) {
    const report = await new Report({
      unit: u._id,
      content: data,
      date: Date.now(),
    }).save({ checkKeys: false });

    if (req.body.template) {
      const template = await Template.findOne({ name: req.body.template });
      await templateController.applyTemplate(report, template);
    }
    // req.log.info(`${rawData}`);
    reply.code(201).send(report);
  } else {
    throw boom.notFound('Unable to find unit');
  }
};

const fetchReportsBySlug = async (req, reply) => {
  const unit = await Unit.findOne({ slug: req.query.unit_slug });

  if (!unit) {
    throw boom.notFound('Unable to find unit');
  }

  const docs = await Report.find({ unit: unit._id }, '-content').populate('template', 'name');
  reply.send(docs);
};

const getContent = async (req, reply) => {
  const report = await Report.findOne({ _id: req.params.id });

  const result = {};

  function recur(obj, path) {
    if (_.isArray(obj)) {
      result[path] = obj[0];
    }
    _.forOwn(obj, (value, key) => {
      if (_.isArray(value) && !_.isEmpty(value)) {
        if (_.isObject(value[0])) {
          result[`${path}.${key}[0]`] = value[0];
        }
      } else if (_.isObject(value)) {
        recur(value, `${path}.${key}`);
      }
    });
  }

  recur(report.content, 'root');


  reply.send(result);
};

const deleteReport = async (req, reply) => {
  const res = await Report.deleteOne({ _id: req.params.id });

  if (res) {
    reply.send();
  } else {
    throw boom.notFound('Unable to find report');
  }
};

export default {
  saveReport, fetchReportsBySlug, getContent, deleteReport,
};
