const { supabaseAdmin, createUserClient, isLiveSupabaseConfigured } = require('../config/supabase');
const { UnauthorizedError } = require('../utils/errors');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Missing or invalid authorization header',
          code: 'UNAUTHORIZED'
        }
      });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Access token is required',
          code: 'UNAUTHORIZED'
        }
      });
    }

    // Live Supabase Authentication
    if (isLiveSupabaseConfigured()) {
      const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
      if (error || !user) {
        return res.status(401).json({
          success: false,
          error: {
            message: 'Invalid or expired token',
            code: 'UNAUTHORIZED'
          }
        });
      }

      req.user = user;
      req.accessToken = token;
      req.supabase = createUserClient(token);
      return next();
    }

    // Local / Dev Fallback: Decode token or mock session
    // Allows immediate local testability and evaluation
    let mockUser = {
      id: 'a1111111-1111-1111-1111-111111111111',
      email: 'maya.lin@stanford.edu',
      user_metadata: {
        full_name: 'Maya Lin',
        avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'
      }
    };

    if (token.startsWith('mock-')) {
      const parts = token.split('-');
      if (parts.length >= 2 && parts[1]) {
        mockUser.id = parts[1];
      }
    } else {
      try {
        // Simple base64 token payload decode if standard JWT format
        const payloadBase64 = token.split('.')[1];
        if (payloadBase64) {
          const decoded = JSON.parse(Buffer.from(payloadBase64, 'base64').toString('utf8'));
          if (decoded.sub || decoded.id) {
            mockUser.id = decoded.sub || decoded.id;
            mockUser.email = decoded.email || mockUser.email;
          }
        }
      } catch (err) {
        // Keep default mock user
      }
    }

    req.user = mockUser;
    req.accessToken = token;
    req.supabase = null;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      error: {
        message: 'Authentication processing failed',
        code: 'AUTH_FAILED'
      }
    });
  }
};

// Optional auth middleware for endpoints that can work for both logged-in and guest users
const optionalAuthMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = null;
    return next();
  }
  return authMiddleware(req, res, next);
};

module.exports = {
  authMiddleware,
  optionalAuthMiddleware
};
