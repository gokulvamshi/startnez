const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { validate } = require('../middleware/validate');
const { authMiddleware } = require('../middleware/auth');
const { authLimiter } = require('../config/rateLimit');
const {
  signupSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema
} = require('../schemas/auth.schemas');

router.post('/signup', authLimiter, validate(signupSchema), authController.signup);
router.post('/login', authLimiter, validate(loginSchema), authController.login);
router.post('/logout', authController.logout);
router.post('/oauth/google', authController.oauthGoogle);
router.post('/oauth/github', authController.oauthGithub);
router.post('/forgot-password', authLimiter, validate(forgotPasswordSchema), authController.forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), authController.resetPassword);
router.get('/session', authMiddleware, authController.getSession);

module.exports = router;
