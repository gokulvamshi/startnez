const startupService = require('../services/startup.service');
const { successResponse } = require('../utils/response');

class StartupController {
  async getStartups(req, res, next) {
    try {
      const currentUserId = req.user ? req.user.id : null;
      const result = await startupService.getStartups(currentUserId, req.query);
      return successResponse(res, result);
    } catch (err) {
      next(err);
    }
  }

  async getStartupById(req, res, next) {
    try {
      const currentUserId = req.user ? req.user.id : null;
      const startup = await startupService.getStartupById(req.params.startupId, currentUserId);
      return successResponse(res, startup);
    } catch (err) {
      next(err);
    }
  }

  async createStartup(req, res, next) {
    try {
      const startup = await startupService.createStartup(req.user.id, req.body);
      return successResponse(res, startup, 201, 'Startup proposal launched successfully');
    } catch (err) {
      next(err);
    }
  }

  async updateStartup(req, res, next) {
    try {
      const updated = await startupService.updateStartup(req.params.startupId, req.user.id, req.body);
      return successResponse(res, updated, 200, 'Startup updated successfully');
    } catch (err) {
      next(err);
    }
  }

  async deleteStartup(req, res, next) {
    try {
      await startupService.deleteStartup(req.params.startupId, req.user.id);
      return successResponse(res, { message: 'Startup removed' });
    } catch (err) {
      next(err);
    }
  }

  async applyToStartup(req, res, next) {
    try {
      const application = await startupService.applyToStartup(req.params.startupId, req.user.id, req.body);
      return successResponse(res, application, 201, 'Application sent to founder');
    } catch (err) {
      next(err);
    }
  }

  async getApplications(req, res, next) {
    try {
      const apps = await startupService.getApplications(req.params.startupId, req.user.id);
      return successResponse(res, apps);
    } catch (err) {
      next(err);
    }
  }

  async acceptApplication(req, res, next) {
    try {
      const result = await startupService.reviewApplication(req.params.applicationId, req.user.id, 'accepted');
      return successResponse(res, result, 200, 'Application accepted and member added to team!');
    } catch (err) {
      next(err);
    }
  }

  async rejectApplication(req, res, next) {
    try {
      const result = await startupService.reviewApplication(req.params.applicationId, req.user.id, 'rejected');
      return successResponse(res, result, 200, 'Application rejected');
    } catch (err) {
      next(err);
    }
  }

  async removeMember(req, res, next) {
    try {
      await startupService.removeMember(req.params.memberId, req.user.id);
      return successResponse(res, { message: 'Member removed from team' });
    } catch (err) {
      next(err);
    }
  }

  async getUserStartups(req, res, next) {
    try {
      const startups = await startupService.getUserStartups(req.params.userId);
      return successResponse(res, startups);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new StartupController();
