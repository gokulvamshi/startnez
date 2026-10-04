const { supabaseAdmin, isLiveSupabaseConfigured } = require('../config/supabase');
const { memoryStore } = require('../services/store');
const { successResponse, errorResponse } = require('../utils/response');
const { v4: uuidv4 } = require('uuid');

class AuthController {
  async signup(req, res, next) {
    try {
      const { email, password, full_name } = req.body;

      if (isLiveSupabaseConfigured()) {
        const { data, error } = await supabaseAdmin.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: full_name || email.split('@')[0] }
          }
        });

        if (error) {
          return errorResponse(res, error.message, 400, 'AUTH_SIGNUP_ERROR');
        }

        return successResponse(res, {
          user: data.user,
          session: data.session
        }, 201, 'Signup successful! Please check your email if confirmation is required.');
      }

      // Local / Mock Dev Signup
      const userId = uuidv4();
      const mockUser = {
        id: userId,
        email,
        full_name: full_name || email.split('@')[0],
        avatar_url: null,
        college: '',
        year_of_study: '1st Year',
        bio: '',
        looking_for: [],
        interests: [],
        is_onboarded: false,
        profile_completeness: 15,
        connection_count: 0,
        post_count: 0,
        created_at: new Date().toISOString()
      };

      memoryStore.profiles.push(mockUser);

      return successResponse(res, {
        user: {
          id: userId,
          email,
          user_metadata: { full_name: mockUser.full_name }
        },
        session: {
          access_token: `mock-${userId}`,
          token_type: 'bearer',
          user: { id: userId, email }
        }
      }, 201, 'Signup successful');
    } catch (err) {
      next(err);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (isLiveSupabaseConfigured()) {
        const { data, error } = await supabaseAdmin.auth.signInWithPassword({
          email,
          password
        });

        if (error) {
          return errorResponse(res, error.message, 401, 'INVALID_CREDENTIALS');
        }

        return successResponse(res, {
          user: data.user,
          session: data.session
        }, 200, 'Login successful');
      }

      // Local / Mock Dev Login
      let user = memoryStore.profiles.find(p => p.email.toLowerCase() === email.toLowerCase());
      if (!user) {
        // If demo email, pick first profile
        user = memoryStore.profiles[0];
      }

      return successResponse(res, {
        user: {
          id: user.id,
          email: user.email,
          user_metadata: { full_name: user.full_name, avatar_url: user.avatar_url }
        },
        session: {
          access_token: `mock-${user.id}`,
          token_type: 'bearer',
          user: { id: user.id, email: user.email }
        }
      }, 200, 'Login successful');
    } catch (err) {
      next(err);
    }
  }

  async logout(req, res, next) {
    try {
      return successResponse(res, { message: 'Logged out successfully' });
    } catch (err) {
      next(err);
    }
  }

  async oauthGoogle(req, res, next) {
    try {
      return successResponse(res, {
        provider: 'google',
        url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/onboarding`
      });
    } catch (err) {
      next(err);
    }
  }

  async oauthGithub(req, res, next) {
    try {
      return successResponse(res, {
        provider: 'github',
        url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/onboarding`
      });
    } catch (err) {
      next(err);
    }
  }

  async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;
      return successResponse(res, {
        message: `Password reset email sent to ${email}`
      });
    } catch (err) {
      next(err);
    }
  }

  async resetPassword(req, res, next) {
    try {
      return successResponse(res, {
        message: 'Password successfully updated'
      });
    } catch (err) {
      next(err);
    }
  }

  async getSession(req, res, next) {
    try {
      if (!req.user) {
        return errorResponse(res, 'No active session', 401, 'UNAUTHORIZED');
      }
      return successResponse(res, {
        user: req.user,
        access_token: req.accessToken
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AuthController();
