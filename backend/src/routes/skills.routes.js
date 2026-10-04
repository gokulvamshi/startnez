const express = require('express');
const router = express.Router();
const skillsController = require('../controllers/skills.controller');
const { authMiddleware } = require('../middleware/auth');

router.get('/list', skillsController.getPredefinedList);
router.get('/me', authMiddleware, skillsController.getMySkills);
router.put('/me', authMiddleware, skillsController.updateMySkills);

module.exports = router;
