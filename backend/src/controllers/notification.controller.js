const notificationService = require('../services/notification.service');
const { successResponse } = require('../utils/response');

class NotificationController {
  async getNotifications(req, res, next) {
    try {
      const page = parseInt(req.query.page || '1', 10);
      const limit = parseInt(req.query.limit || '20', 10);
      const result = await notificationService.getUserNotifications(req.user.id, page, limit);
      return successResponse(res, result);
    } catch (err) {
      next(err);
    }
  }

  async getUnreadCount(req, res, next) {
    try {
      const result = await notificationService.getUserNotifications(req.user.id, 1, 1);
      return successResponse(res, { unread_count: result.unread_count });
    } catch (err) {
      next(err);
    }
  }

  async markAsRead(req, res, next) {
    try {
      await notificationService.markAsRead(req.params.notificationId, req.user.id);
      return successResponse(res, { message: 'Marked as read' });
    } catch (err) {
      next(err);
    }
  }

  async markAllAsRead(req, res, next) {
    try {
      await notificationService.markAllAsRead(req.user.id);
      return successResponse(res, { message: 'All marked as read' });
    } catch (err) {
      next(err);
    }
  }

  async deleteNotification(req, res, next) {
    try {
      await notificationService.deleteNotification(req.params.notificationId, req.user.id);
      return successResponse(res, { message: 'Notification deleted' });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new NotificationController();
