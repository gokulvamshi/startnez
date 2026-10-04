import React from 'react';
import AuthLayout from '../components/layout/AuthLayout';
import ForgotPasswordForm from '../components/auth/ForgotPasswordForm';
import SEOHead from '../components/shared/SEOHead';

export default function ForgotPasswordPage() {
  return (
    <AuthLayout>
      <SEOHead title="Reset Password — HackConnect" />
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
