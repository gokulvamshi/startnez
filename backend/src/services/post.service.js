const { v4: uuidv4 } = require('uuid');
const { memoryStore, isLiveSupabaseConfigured } = require('./store');
const { supabaseAdmin } = require('../config/supabase');
const notificationService = require('./notification.service');
const { NotFoundError, ForbiddenError } = require('../utils/errors');

class PostService {
  async getFeedPosts(currentUserId, query = {}) {
    const page = Math.max(1, parseInt(query.page || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(query.limit || '10', 10)));
    const sort = query.sort || 'latest'; // latest, trending, most_liked, most_commented
    const postType = query.type && query.type !== 'all' ? query.type : null;
    const tagFilter = query.tag ? query.tag.toLowerCase() : null;

    let posts = [...memoryStore.posts];

    // Filter by type
    if (postType) {
      posts = posts.filter(p => p.post_type === postType);
    }

    // Filter by tag
    if (tagFilter) {
      posts = posts.filter(p => p.tags && p.tags.some(t => t.toLowerCase() === tagFilter));
    }

    // Filter by visibility (Connections-Only vs Public)
    posts = posts.filter(post => {
      if (post.visibility === 'public') return true;
      if (!currentUserId) return false;
      if (post.author_id === currentUserId) return true;

      // Check if connected
      const isConnected = memoryStore.connections.some(
        c => c.status === 'accepted' &&
             ((c.requester_id === currentUserId && c.receiver_id === post.author_id) ||
              (c.requester_id === post.author_id && c.receiver_id === currentUserId))
      );
      return isConnected;
    });

    // Sorting
    if (sort === 'most_liked') {
      posts.sort((a, b) => (b.like_count || 0) - (a.like_count || 0));
    } else if (sort === 'most_commented') {
      posts.sort((a, b) => (b.comment_count || 0) - (a.comment_count || 0));
    } else if (sort === 'trending') {
      // Likes * 2 + comments * 3 + recency
      posts.sort((a, b) => {
        const scoreA = ((a.like_count || 0) * 2) + ((a.comment_count || 0) * 3);
        const scoreB = ((b.like_count || 0) * 2) + ((b.comment_count || 0) * 3);
        return scoreB - scoreA;
      });
    } else {
      // latest
      posts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    const total = posts.length;
    const start = (page - 1) * limit;
    const slice = posts.slice(start, start + limit);

    const formattedPosts = slice.map(post => {
      const author = memoryStore.profiles.find(p => p.id === post.author_id);
      const authorSkills = memoryStore.skills.filter(s => s.user_id === post.author_id);
      const primarySkill = authorSkills.find(s => s.is_primary)?.skill_name || authorSkills[0]?.skill_name || 'Builder';

      const isLiked = currentUserId ? memoryStore.postLikes.some(l => l.post_id === post.id && l.user_id === currentUserId) : false;
      const isBookmarked = currentUserId ? memoryStore.postBookmarks.some(b => b.post_id === post.id && b.user_id === currentUserId) : false;

      return {
        id: post.id,
        post_type: post.post_type,
        title: post.title,
        content: post.content,
        images: post.images || [],
        tags: post.tags || [],
        visibility: post.visibility,
        like_count: post.like_count || 0,
        comment_count: post.comment_count || 0,
        bookmark_count: post.bookmark_count || 0,
        is_liked: isLiked,
        is_bookmarked: isBookmarked,
        is_edited: post.is_edited || false,
        created_at: post.created_at,
        author: {
          id: author ? author.id : post.author_id,
          full_name: author ? author.full_name : 'Student Builder',
          avatar_url: author?.avatar_url || null,
          year_of_study: author?.year_of_study || '',
          college: author?.college || '',
          primary_skill: primarySkill
        }
      };
    });

    const hasMore = start + limit < total;
    const nextCursor = hasMore && slice.length > 0 ? slice[slice.length - 1].id : null;

    return {
      posts: formattedPosts,
      pagination: {
        page,
        limit,
        total,
        has_more: hasMore,
        next_cursor: nextCursor
      }
    };
  }

  async getPostById(postId, currentUserId = null) {
    const post = memoryStore.posts.find(p => p.id === postId);
    if (!post) throw new NotFoundError('Post not found');

    const author = memoryStore.profiles.find(p => p.id === post.author_id);
    const authorSkills = memoryStore.skills.filter(s => s.user_id === post.author_id);
    const primarySkill = authorSkills.find(s => s.is_primary)?.skill_name || authorSkills[0]?.skill_name || 'Builder';

    const isLiked = currentUserId ? memoryStore.postLikes.some(l => l.post_id === post.id && l.user_id === currentUserId) : false;
    const isBookmarked = currentUserId ? memoryStore.postBookmarks.some(b => b.post_id === post.id && b.user_id === currentUserId) : false;

    return {
      id: post.id,
      post_type: post.post_type,
      title: post.title,
      content: post.content,
      images: post.images || [],
      tags: post.tags || [],
      visibility: post.visibility,
      like_count: post.like_count || 0,
      comment_count: post.comment_count || 0,
      bookmark_count: post.bookmark_count || 0,
      is_liked: isLiked,
      is_bookmarked: isBookmarked,
      is_edited: post.is_edited || false,
      created_at: post.created_at,
      author: {
        id: author ? author.id : post.author_id,
        full_name: author ? author.full_name : 'Student Builder',
        avatar_url: author?.avatar_url || null,
        year_of_study: author?.year_of_study || '',
        college: author?.college || '',
        primary_skill: primarySkill
      }
    };
  }

  async createPost(authorId, postData) {
    const newPost = {
      id: uuidv4(),
      author_id: authorId,
      post_type: postData.post_type || 'hackathon_experience',
      title: postData.title || null,
      content: postData.content,
      images: postData.images || [],
      tags: postData.tags || [],
      visibility: postData.visibility || 'public',
      like_count: 0,
      comment_count: 0,
      bookmark_count: 0,
      is_edited: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (isLiveSupabaseConfigured()) {
      try {
        await supabaseAdmin.from('posts').insert(newPost);
      } catch (err) {
        console.error('Supabase createPost error:', err);
      }
    }

    memoryStore.posts.unshift(newPost);

    const author = memoryStore.profiles.find(p => p.id === authorId);
    if (author) author.post_count = (author.post_count || 0) + 1;

    return this.getPostById(newPost.id, authorId);
  }

  async updatePost(postId, authorId, updateData) {
    const post = memoryStore.posts.find(p => p.id === postId);
    if (!post) throw new NotFoundError('Post not found');
    if (post.author_id !== authorId) throw new ForbiddenError('You can only edit your own posts');

    Object.assign(post, updateData, {
      is_edited: true,
      updated_at: new Date().toISOString()
    });

    if (isLiveSupabaseConfigured()) {
      try {
        await supabaseAdmin.from('posts').update({
          ...updateData,
          is_edited: true,
          updated_at: post.updated_at
        }).eq('id', postId);
      } catch (err) {
        console.error('Supabase updatePost error:', err);
      }
    }

    return this.getPostById(postId, authorId);
  }

  async deletePost(postId, authorId) {
    const index = memoryStore.posts.findIndex(p => p.id === postId && p.author_id === authorId);
    if (index === -1) throw new NotFoundError('Post not found or permission denied');

    memoryStore.posts.splice(index, 1);

    const author = memoryStore.profiles.find(p => p.id === authorId);
    if (author) author.post_count = Math.max(0, (author.post_count || 0) - 1);

    if (isLiveSupabaseConfigured()) {
      try {
        await supabaseAdmin.from('posts').delete().eq('id', postId);
      } catch (err) {
        console.error('Supabase deletePost error:', err);
      }
    }

    return { success: true };
  }

  async toggleLike(postId, userId) {
    const post = memoryStore.posts.find(p => p.id === postId);
    if (!post) throw new NotFoundError('Post not found');

    const likeIndex = memoryStore.postLikes.findIndex(l => l.post_id === postId && l.user_id === userId);
    let isLiked = false;

    if (likeIndex !== -1) {
      // Unlike
      memoryStore.postLikes.splice(likeIndex, 1);
      post.like_count = Math.max(0, (post.like_count || 0) - 1);
      isLiked = false;

      if (isLiveSupabaseConfigured()) {
        try {
          await supabaseAdmin.from('post_likes').delete().match({ post_id: postId, user_id: userId });
        } catch (err) {
          console.error('Supabase unlike error:', err);
        }
      }
    } else {
      // Like
      const newLike = { id: uuidv4(), post_id: postId, user_id: userId, created_at: new Date().toISOString() };
      memoryStore.postLikes.push(newLike);
      post.like_count = (post.like_count || 0) + 1;
      isLiked = true;

      if (isLiveSupabaseConfigured()) {
        try {
          await supabaseAdmin.from('post_likes').insert(newLike);
        } catch (err) {
          console.error('Supabase like error:', err);
        }
      }

      // Notify post author if not self
      if (post.author_id !== userId) {
        const liker = memoryStore.profiles.find(p => p.id === userId);
        await notificationService.createNotification({
          recipient_id: post.author_id,
          sender_id: userId,
          type: 'post_like',
          title: 'Liked your post',
          message: `${liker?.full_name || 'Someone'} liked your post "${post.title || post.content.slice(0, 30)}..."`,
          reference_id: postId,
          reference_type: 'post'
        });
      }
    }

    return { is_liked: isLiked, like_count: post.like_count };
  }

  async toggleBookmark(postId, userId) {
    const post = memoryStore.posts.find(p => p.id === postId);
    if (!post) throw new NotFoundError('Post not found');

    const bookmarkIndex = memoryStore.postBookmarks.findIndex(b => b.post_id === postId && b.user_id === userId);
    let isBookmarked = false;

    if (bookmarkIndex !== -1) {
      memoryStore.postBookmarks.splice(bookmarkIndex, 1);
      post.bookmark_count = Math.max(0, (post.bookmark_count || 0) - 1);
      isBookmarked = false;
    } else {
      memoryStore.postBookmarks.push({ id: uuidv4(), post_id: postId, user_id: userId, created_at: new Date().toISOString() });
      post.bookmark_count = (post.bookmark_count || 0) + 1;
      isBookmarked = true;
    }

    return { is_bookmarked: isBookmarked, bookmark_count: post.bookmark_count };
  }

  async getComments(postId) {
    const comments = memoryStore.comments.filter(c => c.post_id === postId);
    // Nest replies
    const topLevel = comments.filter(c => !c.parent_comment_id);
    return topLevel.map(comment => {
      const author = memoryStore.profiles.find(p => p.id === comment.author_id);
      const replies = comments
        .filter(c => c.parent_comment_id === comment.id)
        .map(reply => {
          const replyAuthor = memoryStore.profiles.find(p => p.id === reply.author_id);
          return {
            ...reply,
            author: replyAuthor ? { id: replyAuthor.id, full_name: replyAuthor.full_name, avatar_url: replyAuthor.avatar_url } : null
          };
        });

      return {
        ...comment,
        author: author ? { id: author.id, full_name: author.full_name, avatar_url: author.avatar_url } : null,
        replies
      };
    });
  }

  async createComment(postId, authorId, commentData) {
    const post = memoryStore.posts.find(p => p.id === postId);
    if (!post) throw new NotFoundError('Post not found');

    const newComment = {
      id: uuidv4(),
      post_id: postId,
      author_id: authorId,
      parent_comment_id: commentData.parent_comment_id || null,
      content: commentData.content,
      like_count: 0,
      is_edited: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    memoryStore.comments.push(newComment);
    post.comment_count = (post.comment_count || 0) + 1;

    // Trigger notification
    if (post.author_id !== authorId) {
      const commenter = memoryStore.profiles.find(p => p.id === authorId);
      await notificationService.createNotification({
        recipient_id: post.author_id,
        sender_id: authorId,
        type: 'post_comment',
        title: 'New comment on your post',
        message: `${commenter?.full_name || 'Someone'} commented: "${newComment.content.slice(0, 50)}..."`,
        reference_id: postId,
        reference_type: 'post'
      });
    }

    const author = memoryStore.profiles.find(p => p.id === authorId);
    return {
      ...newComment,
      author: author ? { id: author.id, full_name: author.full_name, avatar_url: author.avatar_url } : null,
      replies: []
    };
  }

  async updateComment(commentId, authorId, content) {
    const comment = memoryStore.comments.find(c => c.id === commentId && c.author_id === authorId);
    if (!comment) throw new NotFoundError('Comment not found or permission denied');

    comment.content = content;
    comment.is_edited = true;
    comment.updated_at = new Date().toISOString();
    return comment;
  }

  async deleteComment(commentId, authorId) {
    const index = memoryStore.comments.findIndex(c => c.id === commentId && c.author_id === authorId);
    if (index === -1) throw new NotFoundError('Comment not found or permission denied');

    const comment = memoryStore.comments[index];
    memoryStore.comments.splice(index, 1);

    const post = memoryStore.posts.find(p => p.id === comment.post_id);
    if (post) post.comment_count = Math.max(0, (post.comment_count || 0) - 1);

    return { success: true };
  }

  async getUserPosts(userId, currentUserId = null) {
    const posts = memoryStore.posts.filter(p => p.author_id === userId);
    return posts.map(post => {
      const author = memoryStore.profiles.find(p => p.id === post.author_id);
      return {
        ...post,
        is_liked: currentUserId ? memoryStore.postLikes.some(l => l.post_id === post.id && l.user_id === currentUserId) : false,
        is_bookmarked: currentUserId ? memoryStore.postBookmarks.some(b => b.post_id === post.id && b.user_id === currentUserId) : false,
        author: author ? { id: author.id, full_name: author.full_name, avatar_url: author.avatar_url, college: author.college, year_of_study: author.year_of_study } : null
      };
    });
  }

  async getUserBookmarks(userId) {
    const bookmarks = memoryStore.postBookmarks.filter(b => b.user_id === userId);
    const postIds = bookmarks.map(b => b.post_id);
    const posts = memoryStore.posts.filter(p => postIds.includes(p.id));

    return posts.map(post => {
      const author = memoryStore.profiles.find(p => p.id === post.author_id);
      return {
        ...post,
        is_liked: memoryStore.postLikes.some(l => l.post_id === post.id && l.user_id === userId),
        is_bookmarked: true,
        author: author ? { id: author.id, full_name: author.full_name, avatar_url: author.avatar_url } : null
      };
    });
  }
}

module.exports = new PostService();
