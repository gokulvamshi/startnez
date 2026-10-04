import { api } from './api';

export const profileService = {
  getMe() {
    return api.get('/profiles/me');
  },

  updateProfile(data) {
    return api.put('/profiles/me', data);
  },

  completeOnboarding(data) {
    return api.post('/profiles/me/onboarding', data);
  },

  getProfile(userId) {
    return api.get(`/profiles/${userId}`);
  },

  getDiscovery(params = {}) {
    const query = new URLSearchParams();
    if (params.page) query.append('page', params.page);
    if (params.limit) query.append('limit', params.limit);
    if (params.search) query.append('search', params.search);
    if (params.skills) query.append('skills', params.skills);
    if (params.year) query.append('year', params.year);
    if (params.college) query.append('college', params.college);
    if (params.lookingFor) query.append('lookingFor', params.lookingFor);

    const qs = query.toString();
    return api.get(`/profiles/discover${qs ? `?${qs}` : ''}`);
  },

  searchProfiles(q) {
    return api.get(`/profiles/search?q=${encodeURIComponent(q)}`);
  }
};
