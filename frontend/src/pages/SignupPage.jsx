import React from 'react';
import AuthLayout from '../components/layout/AuthLayout';
import SignupForm from '../components/auth/SignupForm';
import SEOHead from '../components/shared/SEOHead';

export default function SignupPage() {
  return (
    <AuthLayout>
      <SEOHead title="Join Network — HackConnect" />
      <SignupForm />
    </AuthLayout>
  );
}
