const express = require('express');
const router = express.Router();
const searchController = require('../controllers/search.controller');
const { optionalAuthMiddleware } = require('../middleware/auth');

router.get('/', optionalAuthMiddleware, searchController.search);

module.exports = router;
