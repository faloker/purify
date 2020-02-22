import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import Toasted from 'vue-toasted';
import JwtService from './jwt.service';

const ApiService = {
  init() {
    Vue.use(VueAxios, axios);
    Vue.use(Toasted, {
      duration: 3000,
      keepOnHover: true,
      theme: 'toasted-primary',
      iconPack: 'fontawesome',
      position: 'bottom-center',
    });

    Vue.toasted.register(
      'api_error',
      err => {
        if (err.response) {
          return err.response.data.message;
        }
        return 'Something went wrong..';
      },
      {
        type: 'error',
        icon: 'times',
      },
    );

    Vue.toasted.register(
      'api_success',
      payload => payload.msg,
      {
        type: 'success',
        icon: 'check',
      },
    );

    if (process.env.NODE_ENV === 'local') {
      Vue.axios.defaults.baseURL = 'http://localhost:3000';
    } else {
      // set based on the nginx config
      Vue.axios.defaults.baseURL = window.API_URL;
    }

    Vue.axios.interceptors.response.use(
      response => response,
      error => {
        Vue.toasted.global.api_error(error);
        return Promise.reject(error);
      },
    );
  },

  setHeader() {
    Vue.axios.defaults.headers.common.Authorization = `Bearer ${JwtService.getToken()}`;
  },

  query(resource, params) {
    return Vue.axios.get(resource, params);
  },

  get(resource) {
    return Vue.axios.get(resource);
  },

  post(resource, params) {
    return Vue.axios.post(resource, params);
  },

  patch(resource, params) {
    return Vue.axios.patch(resource, params);
  },

  delete(resource) {
    return Vue.axios.delete(resource);
  },
};

export default ApiService;

export const ReportsService = {
  deleteReport(id) {
    return ApiService.delete(`reports/${id}`);
  },

  applyTemplate(reportId, templateId) {
    return ApiService.patch('reports/', reportId, templateId);
  },

  getContent(reportId) {
    return ApiService.get(`reports/${reportId}/content`, reportId);
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
    return ApiService.patch('issues/', payload);
  },

  createTicket(id, payload) {
    return ApiService.post(`issues/${id}/jira`, payload);
  },

  postComment(id, comment) {
    return ApiService.post(`issues/${id}/comment`, comment);
  },
};

// export const ProjectsService = {
//   getProjects() {
//     return ApiService.get('projects/');
//   },
//   createProject(params) {
//     return ApiService.post('projects/', params);
//   },
//   deleteProject(id) {
//     return ApiService.delete(`projects/${id}`);
//   },
// };

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
