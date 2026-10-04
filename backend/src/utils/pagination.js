const getPaginationParams = (query, defaultLimit = 20, maxLimit = 50) => {
  const page = Math.max(1, parseInt(query.page || '1', 10));
  const limit = Math.min(maxLimit, Math.max(1, parseInt(query.limit || String(defaultLimit), 10)));
  const offset = (page - 1) * limit;
  const cursor = query.cursor || null;

  return {
    page,
    limit,
    offset,
    cursor
  };
};

const formatPaginatedResult = (items, total, page, limit, nextCursor = null) => {
  const totalPages = Math.ceil(total / limit);
  const hasMore = page < totalPages || (nextCursor !== null && items.length >= limit);

  return {
    items,
    pagination: {
      page,
      limit,
      total,
      has_more: hasMore,
      next_cursor: nextCursor
    }
  };
};

module.exports = {
  getPaginationParams,
  formatPaginatedResult
};
