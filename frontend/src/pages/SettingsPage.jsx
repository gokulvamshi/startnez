import React from 'react';
import { Settings, Sun, Moon } from 'lucide-react';
import AccountSettings from '../components/settings/AccountSettings';
import NotificationSettings from '../components/settings/NotificationSettings';
import ThemeToggle from '../components/layout/ThemeToggle';
import Card from '../components/shared/Card';
import SEOHead from '../components/shared/SEOHead';

export default function SettingsPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 py-4">
      <SEOHead title="Account & Preferences — HackConnect" />

      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
          <Settings className="w-6 h-6 text-primary-500" />
          <span>Settings & Preferences</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Manage your account credentials, notifications, and visual theme.
        </p>
      </div>

      {/* Visual Theme Card */}
      <Card className="p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl shadow-sm flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Appearance & Theme</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Switch between light and dark visual themes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </Card>

      {/* Account Settings */}
      <AccountSettings />

      {/* Notification Preferences */}
      <NotificationSettings />
    </div>
  );
}
