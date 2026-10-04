import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, Shield, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { authService } from '../../services/authService';
import Input from '../shared/Input';
import Button from '../shared/Button';

export default function AccountSettings() {
  const { user } = useAuthStore();
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState(null);
  const [newPassword, setNewPassword] = useState('');

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters.');
      return;
    }

    try {
      setIsUpdatingPassword(true);
      setPasswordError(null);
      await authService.resetPassword(newPassword);
      setPasswordSuccess(true);
      setNewPassword('');
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (err) {
      setPasswordError(err?.message || 'Failed to update password.');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Email Display */}
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-primary-500" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Account Email</h3>
        </div>
        <p className="text-xs text-slate-500">
          Your primary authentication address on HackConnect.
        </p>
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 font-mono text-xs text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-800">
          {user?.email || 'student@university.edu'}
        </div>
      </div>

      {/* Security & Password */}
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-primary-500" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Update Password</h3>
        </div>
        <p className="text-xs text-slate-500">
          Set a secure, modern password (min. 8 characters, letters & numbers).
        </p>

        {passwordSuccess && (
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 border border-emerald-200 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Password updated successfully!</span>
          </div>
        )}

        {passwordError && (
          <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/30 text-red-600 border border-red-200 text-xs">
            {passwordError}
          </div>
        )}

        <form onSubmit={handlePasswordUpdate} className="space-y-3">
          <Input
            type="password"
            label="New Password"
            placeholder="Min. 8 chars"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={isUpdatingPassword}
          >
            Update Password
          </Button>
        </form>
      </div>
    </div>
  );
}
