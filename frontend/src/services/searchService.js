import { api } from './api';

export const searchService = {
  search(query, type) {
    const qs = new URLSearchParams({ q: query });
    if (type) qs.append('type', type);
    return api.get(`/search?${qs.toString()}`);
  }
};
