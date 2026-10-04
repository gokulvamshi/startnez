const express = require('express');
const router = express.Router();
const postController = require('../controllers/post.controller');
const { authMiddleware, optionalAuthMiddleware } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const {
  createPostSchema,
  updatePostSchema,
  createCommentSchema,
  updateCommentSchema
} = require('../schemas/post.schemas');

router.get('/', optionalAuthMiddleware, postController.getFeed);
router.get('/bookmarks', authMiddleware, postController.getBookmarks);
router.get('/user/:userId', optionalAuthMiddleware, postController.getUserPosts);
router.get('/:postId', optionalAuthMiddleware, postController.getPostById);
router.post('/', authMiddleware, validate(createPostSchema), postController.createPost);
router.put('/:postId', authMiddleware, validate(updatePostSchema), postController.updatePost);
router.delete('/:postId', authMiddleware, postController.deletePost);

router.post('/:postId/like', authMiddleware, postController.toggleLike);
router.post('/:postId/bookmark', authMiddleware, postController.toggleBookmark);

router.get('/:postId/comments', postController.getComments);
router.post('/:postId/comments', authMiddleware, validate(createCommentSchema), postController.createComment);
router.put('/comments/:commentId', authMiddleware, validate(updateCommentSchema), postController.updateComment);
router.delete('/comments/:commentId', authMiddleware, postController.deleteComment);

module.exports = router;
