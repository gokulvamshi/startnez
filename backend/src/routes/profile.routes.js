const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profile.controller');
const { authMiddleware, optionalAuthMiddleware } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const {
  completeOnboardingSchema,
  updateProfileSchema
} = require('../schemas/profile.schemas');

router.get('/me', authMiddleware, profileController.getMyProfile);
router.put('/me', authMiddleware, validate(updateProfileSchema), profileController.updateMyProfile);
router.post('/me/onboarding', authMiddleware, validate(completeOnboardingSchema), profileController.completeOnboarding);
router.get('/discover', optionalAuthMiddleware, profileController.discoverProfiles);
router.get('/search', optionalAuthMiddleware, profileController.searchProfiles);
router.get('/:userId', optionalAuthMiddleware, profileController.getProfileById);

module.exports = router;
