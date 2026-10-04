const connectionService = require('../services/connection.service');
const { successResponse } = require('../utils/response');

class ConnectionController {
  async getConnections(req, res, next) {
    try {
      const page = parseInt(req.query.page || '1', 10);
      const limit = parseInt(req.query.limit || '20', 10);
      const result = await connectionService.getUserConnections(req.user.id, page, limit);
      return successResponse(res, result);
    } catch (err) {
      next(err);
    }
  }

  async getRequests(req, res, next) {
    try {
      const requests = await connectionService.getPendingRequests(req.user.id);
      return successResponse(res, requests);
    } catch (err) {
      next(err);
    }
  }

  async getSentRequests(req, res, next) {
    try {
      const sent = await connectionService.getSentRequests(req.user.id);
      return successResponse(res, sent);
    } catch (err) {
      next(err);
    }
  }

  async sendRequest(req, res, next) {
    try {
      const { receiver_id } = req.body;
      const connection = await connectionService.sendRequest(req.user.id, receiver_id);
      return successResponse(res, connection, 201, 'Connection request sent');
    } catch (err) {
      next(err);
    }
  }

  async acceptRequest(req, res, next) {
    try {
      const accepted = await connectionService.acceptRequest(req.params.connectionId, req.user.id);
      return successResponse(res, accepted, 200, 'Connection accepted!');
    } catch (err) {
      next(err);
    }
  }

  async rejectRequest(req, res, next) {
    try {
      const rejected = await connectionService.rejectRequest(req.params.connectionId, req.user.id);
      return successResponse(res, rejected, 200, 'Connection request declined');
    } catch (err) {
      next(err);
    }
  }

  async removeConnection(req, res, next) {
    try {
      await connectionService.removeConnection(req.params.connectionId, req.user.id);
      return successResponse(res, { message: 'Connection removed' });
    } catch (err) {
      next(err);
    }
  }

  async checkStatus(req, res, next) {
    try {
      const status = await connectionService.checkStatus(req.user.id, req.params.userId);
      return successResponse(res, status);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ConnectionController();
