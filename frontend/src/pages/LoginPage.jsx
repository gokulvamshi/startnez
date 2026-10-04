import React from 'react';
import AuthLayout from '../components/layout/AuthLayout';
import LoginForm from '../components/auth/LoginForm';
import SEOHead from '../components/shared/SEOHead';

export default function LoginPage() {
  return (
    <AuthLayout>
      <SEOHead title="Sign In — HackConnect" />
      <LoginForm />
    </AuthLayout>
  );
}
