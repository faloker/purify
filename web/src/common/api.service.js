import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import Toasted from 'vue-toasted';
import API_URL from '@/common/config';
import JwtService from './jwt.service';

const ApiService = {
  init() {
    Vue.use(VueAxios, axios);
    Vue.use(Toasted, {
      duration: 3000,
      keepOnHover: true,
      theme: 'bubble',
      iconPack: 'fontawesome',
      position: 'bottom-center',
    });

    Vue.toasted.register('api_error',
      (err) => {
        if (err.response) {
          return err.response.data.message;
        }
        return 'Something went wrong..';
      },
      {
        type: 'error',
        icon: 'times',
      });

    Vue.toasted.register('api_success',
      (msg) => {
        if (typeof msg !== 'string') {
          return 'Successful';
        }
        console.log(msg);
        return msg;
      },
      {
        type: 'success',
        icon: 'check',
      });

    Vue.axios.defaults.baseURL = API_URL;
  },

  setHeader() {
    Vue.axios.defaults.headers.common.Authorization = `Bearer ${JwtService.getToken()}`;
  },

  query(resource, params) {
    return Vue.axios.get(resource, params).catch((err) => {
      throw new Error(`Error in ApiService ${err.response.error}`);
    });
  },

  get(resource) {
    return Vue.axios.get(`${resource}`).catch((err) => {
      Vue.toasted.global.api_error(err);
    });
  },

  post(resource, params) {
    return Vue.axios.post(`${resource}`, params).catch((err) => {
      Vue.toasted.global.api_error(err);
    });
  },

  update(resource, params) {
    Vue.axios.patch(`${resource}`, params).then(() => {
      Vue.toasted.global.api_success();
    }).catch((err) => {
      Vue.toasted.global.api_error(err);
    });
  },

  delete(resource) {
    return Vue.axios.delete(resource).then(() => {
      Vue.toasted.global.api_success();
    }).catch((err) => {
      Vue.toasted.global.api_error(err);
    });
  },
};

export default ApiService;

export const ReportsService = {
  deleteReport(id) {
    return ApiService.delete(`reports/${id}`);
  },

  applyTemplate(reportId, templateId) {
    return ApiService.update('reports/', reportId, templateId);
  },

  getContent(reportId) {
    return ApiService.get(`report/${reportId}/content`, reportId);
  },

  fetchReportsByUnit(unitSlug) {
    return ApiService.query('reports/', {
      params: { unit: unitSlug },
    });
  },
};

export const TemplatesService = {
  addTemplate(params) {
    return ApiService.post('templates/', params);
  },
  fetchNames() {
    return ApiService.get('templates/');
  },
};

export const ProfileService = {
  get(user) {
    return ApiService.get(`user/${user}/profile`);
  },
};

export const IssuesService = {
  fetchIssuesByUnit(unitSlug) {
    return ApiService.query('issues/', {
      params: { unit: unitSlug },
    });
  },

  updateIssues(payload) {
    return ApiService.update('issues/', payload);
  },

  createTicket(id, payload) {
    return ApiService.post(`issues/${id}/jira`, payload);
  },

  postComment(id, comment) {
    return ApiService.post(`issues/${id}/comment`, comment);
  },
};

export const ProjectsService = {
  getProjects() {
    return ApiService.get('projects/');
  },
  createProject(params) {
    return ApiService.post('projects/', params);
  },
  deleteProject(id) {
    return ApiService.delete(`projects/${id}`);
  },
};

export const UnitsService = {
  get(slug) {
    return ApiService.query('units/', {
      params: { project: slug },
    });
  },
  delete(id) {
    return ApiService.delete(`releases/${id}`);
  },
  create(params) {
    return ApiService.post('units/', params);
  },
};
