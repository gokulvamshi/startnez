import { api } from './api';

export const connectionService = {
  getConnections(params = {}) {
    const query = new URLSearchParams();
    if (params.page) query.append('page', params.page);
    if (params.limit) query.append('limit', params.limit);
    const qs = query.toString();
    return api.get(`/connections${qs ? `?${qs}` : ''}`);
  },

  getRequests() {
    return api.get('/connections/requests');
  },

  getSentRequests() {
    return api.get('/connections/sent');
  },

  sendRequest(receiverId) {
    return api.post('/connections/request', { receiver_id: receiverId });
  },

  acceptRequest(connectionId) {
    return api.put(`/connections/${connectionId}/accept`, {});
  },

  rejectRequest(connectionId) {
    return api.put(`/connections/${connectionId}/reject`, {});
  },

  removeConnection(connectionId) {
    return api.delete(`/connections/${connectionId}`);
  },

  getStatus(userId) {
    return api.get(`/connections/status/${userId}`);
  }
};
