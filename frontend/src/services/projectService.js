import { api } from './api';

export const projectService = {
  getProjects() {
    return api.get('/projects');
  },

  getProject(projectId) {
    return api.get(`/projects/${projectId}`);
  },

  createProject(data) {
    return api.post('/projects', data);
  },

  updateProject(projectId, data) {
    return api.put(`/projects/${projectId}`, data);
  },

  deleteProject(projectId) {
    return api.delete(`/projects/${projectId}`);
  },

  addMember(projectId, userId, role = 'member') {
    return api.post(`/projects/${projectId}/members`, { user_id: userId, role });
  },

  removeMember(projectId, userId) {
    return api.delete(`/projects/${projectId}/members/${userId}`);
  },

  updateMemberRole(projectId, userId, role) {
    return api.put(`/projects/${projectId}/members/${userId}/role`, { role });
  },

  getLinks(projectId) {
    return api.get(`/projects/${projectId}/links`);
  },

  addLink(projectId, data) {
    return api.post(`/projects/${projectId}/links`, data);
  },

  deleteLink(linkId) {
    return api.delete(`/projects/links/${linkId}`);
  },

  getNotes(projectId) {
    return api.get(`/projects/${projectId}/notes`);
  },

  createNote(projectId, data) {
    return api.post(`/projects/${projectId}/notes`, data);
  },

  updateNote(noteId, data) {
    return api.put(`/projects/notes/${noteId}`, data);
  },

  deleteNote(noteId) {
    return api.delete(`/projects/notes/${noteId}`);
  }
};
