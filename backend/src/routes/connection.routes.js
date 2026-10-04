const express = require('express');
const router = express.Router();
const connectionController = require('../controllers/connection.controller');
const { authMiddleware } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { connectionRequestSchema } = require('../schemas/profile.schemas');

router.use(authMiddleware);

router.get('/', connectionController.getConnections);
router.get('/requests', connectionController.getRequests);
router.get('/sent', connectionController.getSentRequests);
router.post('/request', validate(connectionRequestSchema), connectionController.sendRequest);
router.put('/:connectionId/accept', connectionController.acceptRequest);
router.put('/:connectionId/reject', connectionController.rejectRequest);
router.delete('/:connectionId', connectionController.removeConnection);
router.get('/status/:userId', connectionController.checkStatus);

module.exports = router;
