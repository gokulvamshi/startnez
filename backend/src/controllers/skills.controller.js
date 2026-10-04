const profileService = require('../services/profile.service');
const { memoryStore } = require('../services/store');
const { SKILL_DOMAINS, ALL_PREDEFINED_SKILLS } = require('../utils/constants');
const { successResponse } = require('../utils/response');

class SkillsController {
  async getMySkills(req, res, next) {
    try {
      const skills = memoryStore.skills.filter(s => s.user_id === req.user.id);
      return successResponse(res, skills);
    } catch (err) {
      next(err);
    }
  }

  async updateMySkills(req, res, next) {
    try {
      const { skills } = req.body;
      const updated = await profileService.updateSkills(req.user.id, skills || []);
      return successResponse(res, updated, 200, 'Skills updated successfully');
    } catch (err) {
      next(err);
    }
  }

  async getPredefinedList(req, res, next) {
    try {
      return successResponse(res, {
        domains: SKILL_DOMAINS,
        all_skills: ALL_PREDEFINED_SKILLS
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new SkillsController();
