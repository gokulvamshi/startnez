const searchService = require('../services/search.service');
const { successResponse } = require('../utils/response');

class SearchController {
  async search(req, res, next) {
    try {
      const { q, query, type = 'all', limit = 20 } = req.query;
      const searchTarget = q || query || '';
      const results = await searchService.search(searchTarget, type, parseInt(limit, 10));
      return successResponse(res, results);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new SearchController();
