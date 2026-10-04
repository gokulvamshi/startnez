import React, { useState } from 'react';
import { Bell, Check } from 'lucide-react';
import Button from '../shared/Button';

export default function NotificationSettings() {
  const [preferences, setPreferences] = useState({
    connection_requests: true,
    post_activity: true,
    project_invites: true,
    project_messages: true,
    startup_applications: true
  });
  const [isSaved, setIsSaved] = useState(false);

  const toggle = (key) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
    setIsSaved(false);
  };

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const SETTING_ITEMS = [
    { key: 'connection_requests', title: 'Connection Requests', desc: 'Notify when builders want to connect for hackathons' },
    { key: 'post_activity', title: 'Post Interactions', desc: 'Notify when users like or comment on your showcases' },
    { key: 'project_invites', title: 'Workspace Invitations', desc: 'Notify when teammates add you to project teams' },
    { key: 'project_messages', title: 'Workspace Chat Messages', desc: 'Notify on real-time discussions in your projects' },
    { key: 'startup_applications', title: 'Venture Applications', desc: 'Notify when founders review or reply to your applications' }
  ];

  return (
    <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
      <div className="flex items-center gap-2">
        <Bell className="w-4 h-4 text-primary-500" />
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          Notification Preferences
        </h3>
      </div>
      <p className="text-xs text-slate-500">
        Control real-time and in-app alert triggers across your campus network.
      </p>

      <div className="divide-y divide-slate-100 dark:divide-slate-800 space-y-2">
        {SETTING_ITEMS.map((item) => (
          <div key={item.key} className="flex items-center justify-between py-3 pt-3">
            <div>
              <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                {item.title}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">{item.desc}</p>
            </div>

            <button
              type="button"
              onClick={() => toggle(item.key)}
              className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none ${
                preferences[item.key] ? 'bg-primary-600' : 'bg-slate-200 dark:bg-slate-700'
              }`}
            >
              <span
                className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                  preferences[item.key] ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        ))}
      </div>

      <div className="pt-2 flex items-center justify-between">
        {isSaved ? (
          <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
            <Check className="w-4 h-4" />
            <span>Preferences saved!</span>
          </span>
        ) : <div />}
        <Button variant="primary" size="sm" onClick={handleSave}>
          Save Preferences
        </Button>
      </div>
    </div>
  );
}
