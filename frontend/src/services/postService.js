import { api } from './api';

export const postService = {
  getPosts(params = {}) {
    const query = new URLSearchParams();
    if (params.page) query.append('page', params.page);
    if (params.limit) query.append('limit', params.limit);
    if (params.sort) query.append('sort', params.sort);
    if (params.type) query.append('type', params.type);

    const qs = query.toString();
    return api.get(`/posts${qs ? `?${qs}` : ''}`);
  },

  getPost(postId) {
    return api.get(`/posts/${postId}`);
  },

  createPost(data) {
    return api.post('/posts', data);
  },

  updatePost(postId, data) {
    return api.put(`/posts/${postId}`, data);
  },

  deletePost(postId) {
    return api.delete(`/posts/${postId}`);
  },

  toggleLike(postId) {
    return api.post(`/posts/${postId}/like`, {});
  },

  getComments(postId) {
    return api.get(`/posts/${postId}/comments`);
  },

  createComment(postId, data) {
    return api.post(`/posts/${postId}/comments`, data);
  },

  toggleBookmark(postId) {
    return api.post(`/posts/${postId}/bookmark`, {});
  },

  getBookmarks() {
    return api.get('/posts/bookmarks');
  },

  getUserPosts(userId) {
    return api.get(`/posts/user/${userId}`);
  }
};
