const postService = require('../services/post.service');
const { successResponse } = require('../utils/response');

class PostController {
  async getFeed(req, res, next) {
    try {
      const currentUserId = req.user ? req.user.id : null;
      const result = await postService.getFeedPosts(currentUserId, req.query);
      return successResponse(res, result);
    } catch (err) {
      next(err);
    }
  }

  async getPostById(req, res, next) {
    try {
      const currentUserId = req.user ? req.user.id : null;
      const post = await postService.getPostById(req.params.postId, currentUserId);
      return successResponse(res, post);
    } catch (err) {
      next(err);
    }
  }

  async createPost(req, res, next) {
    try {
      const post = await postService.createPost(req.user.id, req.body);
      return successResponse(res, post, 201, 'Post published successfully');
    } catch (err) {
      next(err);
    }
  }

  async updatePost(req, res, next) {
    try {
      const updated = await postService.updatePost(req.params.postId, req.user.id, req.body);
      return successResponse(res, updated, 200, 'Post updated successfully');
    } catch (err) {
      next(err);
    }
  }

  async deletePost(req, res, next) {
    try {
      await postService.deletePost(req.params.postId, req.user.id);
      return successResponse(res, { message: 'Post deleted successfully' });
    } catch (err) {
      next(err);
    }
  }

  async toggleLike(req, res, next) {
    try {
      const result = await postService.toggleLike(req.params.postId, req.user.id);
      return successResponse(res, result);
    } catch (err) {
      next(err);
    }
  }

  async toggleBookmark(req, res, next) {
    try {
      const result = await postService.toggleBookmark(req.params.postId, req.user.id);
      return successResponse(res, result);
    } catch (err) {
      next(err);
    }
  }

  async getComments(req, res, next) {
    try {
      const comments = await postService.getComments(req.params.postId);
      return successResponse(res, comments);
    } catch (err) {
      next(err);
    }
  }

  async createComment(req, res, next) {
    try {
      const comment = await postService.createComment(req.params.postId, req.user.id, req.body);
      return successResponse(res, comment, 201, 'Comment added');
    } catch (err) {
      next(err);
    }
  }

  async updateComment(req, res, next) {
    try {
      const updated = await postService.updateComment(req.params.commentId, req.user.id, req.body.content);
      return successResponse(res, updated, 200, 'Comment updated');
    } catch (err) {
      next(err);
    }
  }

  async deleteComment(req, res, next) {
    try {
      await postService.deleteComment(req.params.commentId, req.user.id);
      return successResponse(res, { message: 'Comment deleted' });
    } catch (err) {
      next(err);
    }
  }

  async getBookmarks(req, res, next) {
    try {
      const bookmarks = await postService.getUserBookmarks(req.user.id);
      return successResponse(res, bookmarks);
    } catch (err) {
      next(err);
    }
  }

  async getUserPosts(req, res, next) {
    try {
      const currentUserId = req.user ? req.user.id : null;
      const posts = await postService.getUserPosts(req.params.userId, currentUserId);
      return successResponse(res, posts);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new PostController();
