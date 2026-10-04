import { api } from './api';

export const fileService = {
  getFiles(projectId) {
    return api.get(`/projects/${projectId}/files`);
  },

  uploadFile(projectId, data) {
    return api.post(`/projects/${projectId}/files`, data);
  },

  deleteFile(fileId) {
    return api.delete(`/projects/files/${fileId}`);
  }
};
