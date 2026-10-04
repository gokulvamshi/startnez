import { api } from './api';

export const notificationService = {
  getNotifications(params = {}) {
    const query = new URLSearchParams();
    if (params.page) query.append('page', params.page);
    if (params.limit) query.append('limit', params.limit);
    const qs = query.toString();
    return api.get(`/notifications${qs ? `?${qs}` : ''}`);
  },

  getUnreadCount() {
    return api.get('/notifications/unread-count');
  },

  markAsRead(notificationId) {
    return api.put(`/notifications/${notificationId}/read`, {});
  },

  markAllAsRead() {
    return api.put('/notifications/read-all', {});
  },

  deleteNotification(notificationId) {
    return api.delete(`/notifications/${notificationId}`);
  }
};
