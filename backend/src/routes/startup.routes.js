const express = require('express');
const router = express.Router();
const startupController = require('../controllers/startup.controller');
const { authMiddleware, optionalAuthMiddleware } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const {
  createStartupSchema,
  updateStartupSchema,
  applyToStartupSchema
} = require('../schemas/startup.schemas');

router.get('/', optionalAuthMiddleware, startupController.getStartups);
router.get('/user/:userId', optionalAuthMiddleware, startupController.getUserStartups);
router.get('/:startupId', optionalAuthMiddleware, startupController.getStartupById);
router.post('/', authMiddleware, validate(createStartupSchema), startupController.createStartup);
router.put('/:startupId', authMiddleware, validate(updateStartupSchema), startupController.updateStartup);
router.delete('/:startupId', authMiddleware, startupController.deleteStartup);

router.post('/:startupId/apply', authMiddleware, validate(applyToStartupSchema), startupController.applyToStartup);
router.get('/:startupId/applications', authMiddleware, startupController.getApplications);
router.put('/applications/:applicationId/accept', authMiddleware, startupController.acceptApplication);
router.put('/applications/:applicationId/reject', authMiddleware, startupController.rejectApplication);
router.delete('/members/:memberId', authMiddleware, startupController.removeMember);

module.exports = router;
