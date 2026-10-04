import { api } from './api';

export const startupService = {
  getStartups(params = {}) {
    const query = new URLSearchParams();
    if (params.page) query.append('page', params.page);
    if (params.limit) query.append('limit', params.limit);
    if (params.stage) query.append('stage', params.stage);
    if (params.role) query.append('role', params.role);
    if (params.tech) query.append('tech', params.tech);
    if (params.search) query.append('search', params.search);

    const qs = query.toString();
    return api.get(`/startups${qs ? `?${qs}` : ''}`);
  },

  getStartup(startupId) {
    return api.get(`/startups/${startupId}`);
  },

  createStartup(data) {
    return api.post('/startups', data);
  },

  updateStartup(startupId, data) {
    return api.put(`/startups/${startupId}`, data);
  },

  deleteStartup(startupId) {
    return api.delete(`/startups/${startupId}`);
  },

  applyToStartup(startupId, data) {
    return api.post(`/startups/${startupId}/apply`, data);
  },

  getApplications(startupId) {
    return api.get(`/startups/${startupId}/applications`);
  },

  acceptApplication(applicationId) {
    return api.put(`/startups/applications/${applicationId}/accept`, {});
  },

  rejectApplication(applicationId) {
    return api.put(`/startups/applications/${applicationId}/reject`, {});
  },

  getUserStartups(userId) {
    return api.get(`/startups/user/${userId}`);
  }
};
