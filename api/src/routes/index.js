import docs from './documentation';
import reportController from '../controllers/reportController';
import unitController from '../controllers/unitController';
import projectController from '../controllers/projectController';
import templateController from '../controllers/templateController';
import issueController from '../controllers/issueController';
import userController from '../controllers/userController';

const projects = [
  {
    method: 'POST',
    url: '/api/projects',
    handler: projectController.createProject,
    schema: docs.projects.create,
  },
  {
    method: 'GET',
    url: '/api/projects',
    handler: projectController.fetchProjects,
  },
];

const units = [
  {
    method: 'POST',
    url: '/api/units',
    handler: unitController.createUnit,
    schema: docs.units.create,
  },
  {
    method: 'GET',
    url: '/api/project/:slug/units',
    handler: unitController.getUnitsByProjectSlug,
    schema: docs.units.getByProjectSlug,
  },
  {
    method: 'GET',
    url: '/api/units',
    handler: unitController.fetchUnits,
    schema: docs.units.fetch,
  },
];

const reports = [
  {
    method: 'POST',
    url: '/api/reports',
    handler: reportController.saveReport,
    schema: docs.reports.save,
  },
  {
    method: 'GET',
    url: '/api/reports',
    handler: reportController.fetchReportsBySlug,
    schema: docs.reports.fetchByUnit,
  },
  {
    method: 'GET',
    url: '/api/report/:id/content',
    handler: reportController.getContent,
  },
  {
    method: 'DELETE',
    url: '/api/reports/:id',
    handler: reportController.deleteReport,
  },
];

const templates = [
  {
    method: 'POST',
    url: '/api/templates',
    handler: templateController.saveTemplate,
    schema: docs.templates.save,
  },
  {
    method: 'GET',
    url: '/api/templates',
    handler: templateController.fetchTemplatesNames,
  },
];

const issues = [
  {
    method: 'GET',
    url: '/api/issues',
    handler: issueController.fetchByUnit,
  },
  {
    method: 'PATCH',
    url: '/api/issues',
    handler: issueController.updateIssues,
  },
  {
    method: 'POST',
    url: '/api/issue/:id/jira',
    handler: issueController.createJiraTicket,
  },
];

const users = [
  {
    method: 'POST',
    url: '/api/signup',
    handler: userController.createUser,
    schema: docs.users.create,
  },
  {
    method: 'GET',
    url: '/api/auth',
    handler: userController.authUser,
    schema: docs.users.auth,
  },
  {
    method: 'POST',
    url: '/api/login',
    handler: userController.loginUser,
    schema: docs.users.login,
  },
];

const routes = [
  ...projects,
  ...units,
  ...reports,
  ...templates,
  ...issues,
  ...users,
];

module.exports = routes;
