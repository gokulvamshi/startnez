import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { resetPasswordSchema } from '../../schemas/authSchemas';
import { authService } from '../../services/authService';
import Input from '../shared/Input';
import Button from '../shared/Button';
import { ROUTES } from '../../config/routes';

export default function ResetPasswordForm() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirm_password: '' }
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setServerError(null);
      await authService.resetPassword(data.password);
      setIsSuccess(true);
      setTimeout(() => {
        navigate(ROUTES.LOGIN);
      }, 2500);
    } catch (err) {
      setServerError(err?.message || 'Password update failed. Token may be expired.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="w-full max-w-md mx-auto text-center space-y-6">
        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mx-auto ring-8 ring-emerald-50 dark:ring-emerald-900/20">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Password Updated!</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Your credentials have been securely refreshed. Redirecting you to login...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          New Credentials
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
          Create a secure new password for your HackConnect account.
        </p>
      </div>

      {serverError && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 text-sm text-red-600 dark:text-red-400">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="New Password"
          type="password"
          placeholder="Min. 8 chars, 1 number & uppercase"
          icon={<Lock className="w-4 h-4 text-slate-400" />}
          error={errors.password?.message}
          {...register('password')}
        />

        <Input
          label="Confirm New Password"
          type="password"
          placeholder="Repeat new password"
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
          <span>Update Password</span>
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </form>
    </div>
  );
}
