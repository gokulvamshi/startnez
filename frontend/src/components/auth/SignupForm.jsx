import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import { signupSchema } from '../../schemas/authSchemas';
import { useAuthStore } from '../../stores/authStore';
import Input from '../shared/Input';
import Button from '../shared/Button';
import OAuthButtons from './OAuthButtons';
import { ROUTES } from '../../config/routes';

export default function SignupForm() {
  const navigate = useNavigate();
  const { signup, loginWithOAuth, isLoading, error, clearError } = useAuthStore();
  const [authError, setAuthError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      full_name: '',
      email: '',
      password: '',
      confirm_password: ''
    }
  });

  const onSubmit = async (data) => {
    try {
      setAuthError(null);
      clearError();
      await signup(data.email, data.password, data.full_name);
      navigate(ROUTES.ONBOARDING);
    } catch (err) {
      setAuthError(err?.message || 'Registration failed. Please check your credentials.');
    }
  };

  const handleOAuth = async (provider) => {
    try {
      setAuthError(null);
      clearError();
      await loginWithOAuth(provider);
      navigate(ROUTES.HOME);
    } catch (err) {
      setAuthError(err?.message || `Failed to sign up with ${provider}`);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Join the Network
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
          Connect with elite student developers, designers & founders.
        </p>
      </div>

      {(authError || error) && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 text-sm text-red-600 dark:text-red-400">
          {authError || error}
        </div>
      )}

      <OAuthButtons onSelect={handleOAuth} isLoading={isLoading} />

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200 dark:border-slate-800" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white dark:bg-slate-900 px-3 text-slate-400 font-medium tracking-wider">
            Or register with student email
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Full Name"
          placeholder="e.g. Maya Chen"
          icon={<User className="w-4 h-4 text-slate-400" />}
          error={errors.full_name?.message}
          {...register('full_name')}
        />

        <Input
          label="Email Address"
          type="email"
          placeholder="student@university.edu"
          icon={<Mail className="w-4 h-4 text-slate-400" />}
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label="Password"
          type="password"
          placeholder="Min. 8 chars, 1 number & uppercase"
          icon={<Lock className="w-4 h-4 text-slate-400" />}
          error={errors.password?.message}
          {...register('password')}
        />

        <Input
          label="Confirm Password"
          type="password"
          placeholder="Repeat your password"
          icon={<Lock className="w-4 h-4 text-slate-400" />}
          error={errors.confirm_password?.message}
          {...register('confirm_password')}
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full mt-2"
          isLoading={isLoading}
        >
          <span>Create Account</span>
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </form>

      <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-6">
        By registering, you agree to HackConnect's{' '}
        <span className="text-primary-600 dark:text-primary-400 cursor-pointer hover:underline">Terms</span> and{' '}
        <span className="text-primary-600 dark:text-primary-400 cursor-pointer hover:underline">Privacy Policy</span>.
      </p>

      <div className="text-center text-sm text-slate-600 dark:text-slate-400 mt-6">
        Already have an account?{' '}
        <Link to={ROUTES.LOGIN} className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">
          Sign In
        </Link>
      </div>
    </div>
  );
}
