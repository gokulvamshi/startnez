import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { forgotPasswordSchema } from '../../schemas/authSchemas';
import { authService } from '../../services/authService';
import Input from '../shared/Input';
import Button from '../shared/Button';
import { ROUTES } from '../../config/routes';

export default function ForgotPasswordForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' }
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setServerError(null);
      await authService.forgotPassword(data.email);
      setIsSubmitted(true);
    } catch (err) {
      setServerError(err?.message || 'Failed to send reset link. Please verify your email.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="w-full max-w-md mx-auto text-center space-y-6">
        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mx-auto ring-8 ring-emerald-50 dark:ring-emerald-900/20">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Check Your Inbox</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          We’ve sent a password reset link to your email address if an associated account exists. Follow the link inside to set a new password.
        </p>
        <Link to={ROUTES.LOGIN}>
          <Button variant="outline" className="w-full mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span>Return to Login</span>
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Reset Password
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
          Enter your university or account email to receive a password reset link.
        </p>
      </div>

      {serverError && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 text-sm text-red-600 dark:text-red-400">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          placeholder="your.email@university.edu"
          icon={<Mail className="w-4 h-4 text-slate-400" />}
          error={errors.email?.message}
          {...register('email')}
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full mt-2"
          isLoading={isLoading}
        >
          <span>Send Reset Instructions</span>
        </Button>
      </form>

      <div className="text-center text-sm text-slate-600 dark:text-slate-400 mt-6">
        Remembered your password?{' '}
        <Link to={ROUTES.LOGIN} className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">
          Back to Login
        </Link>
      </div>
    </div>
  );
}
