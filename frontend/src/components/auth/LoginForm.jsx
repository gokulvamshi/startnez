import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { loginSchema } from '../../schemas/authSchemas';
import { useAuthStore } from '../../stores/authStore';
import { Input } from '../shared/Input';
import { Button } from '../shared/Button';
import { OAuthButtons } from './OAuthButtons';
import { ROUTES } from '../../config/routes';
import { toast } from 'react-hot-toast';
import { Mail, Lock, ArrowRight } from 'lucide-react';

export const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (values) => {
    setIsLoading(true);
    try {
      const result = await login(values.email, values.password);
      toast.success('Welcome back to HackConnect!');
      if (result.profile && !result.profile.is_onboarded) {
        navigate(ROUTES.ONBOARDING);
      } else {
        navigate(ROUTES.HOME);
      }
    } catch (error) {
      toast.error(error.message || 'Login failed. Please verify your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-5 w-full">
      <OAuthButtons />

      <div className="relative flex items-center justify-center my-1">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200 dark:border-slate-800" />
        </div>
        <span className="relative px-3 bg-white dark:bg-slate-900 text-[11px] font-mono uppercase text-slate-400">
          Or continue with email
        </span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          label="College / Student Email"
          type="email"
          placeholder="yourname@university.edu"
          autoComplete="email"
          leftIcon={<Mail className="w-4 h-4" />}
          error={errors.email?.message}
          {...register('email')}
        />

        <div className="flex flex-col gap-1">
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            leftIcon={<Lock className="w-4 h-4" />}
            error={errors.password?.message}
            {...register('password')}
          />
          <div className="flex justify-end pt-1">
            <Link
              to={ROUTES.FORGOT_PASSWORD}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <Button
          type="submit"
          isLoading={isLoading}
          className="w-full mt-2"
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          Sign In
        </Button>
      </form>

      <div className="text-center text-xs text-slate-500 pt-2">
        Don't have an account?{' '}
        <Link to={ROUTES.SIGNUP} className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
          Create student profile
        </Link>
      </div>
    </div>
  );
};

export default LoginForm;
