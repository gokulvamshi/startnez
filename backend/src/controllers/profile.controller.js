const profileService = require('../services/profile.service');
const { successResponse, errorResponse } = require('../utils/response');

class ProfileController {
  async getMyProfile(req, res, next) {
    try {
      const profile = await profileService.getProfileById(req.user.id, req.user.id);
      if (!profile) {
        return errorResponse(res, 'Profile not found', 404, 'PROFILE_NOT_FOUND');
      }
      return successResponse(res, profile);
    } catch (err) {
      next(err);
    }
  }

  async updateMyProfile(req, res, next) {
    try {
      const updated = await profileService.updateProfile(req.user.id, req.body);
      return successResponse(res, updated, 200, 'Profile updated successfully');
    } catch (err) {
      next(err);
    }
  }

  async completeOnboarding(req, res, next) {
    try {
      const profile = await profileService.completeOnboarding(req.user.id, req.body, req.user?.email);
      return successResponse(res, profile, 200, 'Onboarding completed! Welcome to HackConnect.');
    } catch (err) {
      next(err);
    }
  }

  async discoverProfiles(req, res, next) {
    try {
      const result = await profileService.discoverProfiles(req.user ? req.user.id : null, req.query);
      return successResponse(res, result);
    } catch (err) {
      next(err);
    }
  }

  async getProfileById(req, res, next) {
    try {
      const currentUserId = req.user ? req.user.id : null;
      const profile = await profileService.getProfileById(req.params.userId, currentUserId);
      if (!profile) {
        return errorResponse(res, 'User profile not found', 404, 'PROFILE_NOT_FOUND');
      }
      return successResponse(res, profile);
    } catch (err) {
      next(err);
    }
  }

  async searchProfiles(req, res, next) {
    try {
      const query = req.query.q || '';
      const result = await profileService.discoverProfiles(req.user ? req.user.id : null, { search: query, limit: 20 });
      return successResponse(res, result);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ProfileController();
