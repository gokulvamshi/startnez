export const ROUTES = {
  // Public
  LANDING: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',

  // Protected
  ONBOARDING: '/onboarding',
  HOME: '/home', // Discovery Feed (Primary Feature)
  FEED: '/feed',
  FEED_CREATE: '/feed/create',
  POST_DETAIL: (id = ':postId') => `/feed/${id}`,
  STARTUPS: '/startups',
  STARTUPS_CREATE: '/startups/create',
  STARTUP_DETAIL: (id = ':startupId') => `/startups/${id}`,
  PROFILE: (id = ':userId') => `/profile/${id}`,
  PROFILE_EDIT: '/profile/edit',
  PROJECTS: '/projects',
  PROJECTS_CREATE: '/projects/create',
  PROJECT_WORKSPACE: (id = ':projectId') => `/projects/${id}`,
  NOTIFICATIONS: '/notifications',
  CONNECTIONS: '/connections',
  SEARCH: '/search',
  SETTINGS: '/settings'
};
