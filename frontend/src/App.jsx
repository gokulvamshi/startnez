import React, { useEffect, Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import { useUiStore } from './stores/uiStore';
import { ROUTES } from './config/routes';
import AppLayout from './components/layout/AppLayout';
import ProtectedRoute from './components/shared/ProtectedRoute';
import GuestGuard from './components/shared/GuestGuard';
import LoadingSpinner from './components/shared/LoadingSpinner';

// Lazy-loaded Page Routes for Code Splitting & Performance Optimization
const LandingPage = lazy(() => import('./pages/LandingPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'));
const OnboardingPage = lazy(() => import('./pages/OnboardingPage'));
const HomePage = lazy(() => import('./pages/HomePage'));
const FeedPage = lazy(() => import('./pages/FeedPage'));
const CreatePostPage = lazy(() => import('./pages/CreatePostPage'));
const PostDetailPage = lazy(() => import('./pages/PostDetailPage'));
const StartupsPage = lazy(() => import('./pages/StartupsPage'));
const CreateStartupPage = lazy(() => import('./pages/CreateStartupPage'));
const StartupDetailPage = lazy(() => import('./pages/StartupDetailPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const EditProfilePage = lazy(() => import('./pages/EditProfilePage'));
const ProjectsListPage = lazy(() => import('./pages/ProjectsListPage'));
const CreateProjectPage = lazy(() => import('./pages/CreateProjectPage'));
const ProjectWorkspacePage = lazy(() => import('./pages/ProjectWorkspacePage'));
const NotificationsPage = lazy(() => import('./pages/NotificationsPage'));
const ConnectionsPage = lazy(() => import('./pages/ConnectionsPage'));
const SearchResultsPage = lazy(() => import('./pages/SearchResultsPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

export default function App() {
  const { initAuth } = useAuthStore();
  const { theme } = useUiStore();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  useEffect(() => {
    // Synchronize HTML theme class
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
          <LoadingSpinner size="lg" message="Loading HackConnect..." />
        </div>
      }
    >
      <Routes>
        {/* Public Routes with GuestGuard */}
        <Route
          path={ROUTES.LANDING}
          element={
            <GuestGuard>
              <LandingPage />
            </GuestGuard>
          }
        />
        <Route
          path={ROUTES.LOGIN}
          element={
            <GuestGuard>
              <LoginPage />
            </GuestGuard>
          }
        />
        <Route
          path={ROUTES.SIGNUP}
          element={
            <GuestGuard>
              <SignupPage />
            </GuestGuard>
          }
        />
        <Route
          path={ROUTES.FORGOT_PASSWORD}
          element={
            <GuestGuard>
              <ForgotPasswordPage />
            </GuestGuard>
          }
        />
        <Route
          path={ROUTES.RESET_PASSWORD}
          element={
            <GuestGuard>
              <ResetPasswordPage />
            </GuestGuard>
          }
        />

        {/* Onboarding Route (Must be authenticated, not onboarded yet) */}
        <Route
          path={ROUTES.ONBOARDING}
          element={
            <ProtectedRoute requireOnboarded={false}>
              <OnboardingPage />
            </ProtectedRoute>
          }
        />

        {/* Protected App Routes inside AppLayout */}
        <Route
          element={
            <ProtectedRoute requireOnboarded={true}>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={ROUTES.FEED} element={<FeedPage />} />
          <Route path={ROUTES.FEED_CREATE} element={<CreatePostPage />} />
          <Route path={ROUTES.POST_DETAIL()} element={<PostDetailPage />} />
          <Route path={ROUTES.STARTUPS} element={<StartupsPage />} />
          <Route path={ROUTES.STARTUPS_CREATE} element={<CreateStartupPage />} />
          <Route path={ROUTES.STARTUP_DETAIL()} element={<StartupDetailPage />} />
          <Route path={ROUTES.PROFILE()} element={<ProfilePage />} />
          <Route path={ROUTES.PROFILE_EDIT} element={<EditProfilePage />} />
          <Route path={ROUTES.PROJECTS} element={<ProjectsListPage />} />
          <Route path={ROUTES.PROJECTS_CREATE} element={<CreateProjectPage />} />
          <Route path={ROUTES.PROJECT_WORKSPACE()} element={<ProjectWorkspacePage />} />
          <Route path={ROUTES.NOTIFICATIONS} element={<NotificationsPage />} />
          <Route path={ROUTES.CONNECTIONS} element={<ConnectionsPage />} />
          <Route path={ROUTES.SEARCH} element={<SearchResultsPage />} />
          <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
