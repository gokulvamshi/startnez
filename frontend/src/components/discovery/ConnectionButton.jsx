import React, { useState } from 'react';
import { UserPlus, Clock, Check, UserCheck, Loader2 } from 'lucide-react';
import Button from '../shared/Button';
import { connectionService } from '../../services/connectionService';

export default function ConnectionButton({
  userId,
  initialStatus = 'none',
  onStatusChange,
  size = 'sm',
  className = ''
}) {
  const [status, setStatus] = useState(initialStatus);
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = async (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (isLoading) return;

    try {
      setIsLoading(true);

      if (status === 'none') {
        await connectionService.sendRequest(userId);
        setStatus('pending_sent');
        onStatusChange?.('pending_sent');
      } else if (status === 'pending_received') {
        await connectionService.acceptRequest(userId);
        setStatus('connected');
        onStatusChange?.('connected');
      }
    } catch (err) {
      console.error('Connection action failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'connected') {
    return (
      <Button
        variant="secondary"
        size={size}
        className={`text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 cursor-default ${className}`}
        disabled
      >
        <UserCheck className="w-3.5 h-3.5 mr-1.5 text-emerald-500" />
        <span>Connected</span>
      </Button>
    );
  }

  if (status === 'pending_sent') {
    return (
      <Button
        variant="outline"
        size={size}
        className={`text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 ${className}`}
        disabled
      >
        <Clock className="w-3.5 h-3.5 mr-1.5 text-amber-500" />
        <span>Requested</span>
      </Button>
    );
  }

  if (status === 'pending_received') {
    return (
      <Button
        variant="primary"
        size={size}
        isLoading={isLoading}
        onClick={handleAction}
        className={className}
      >
        <Check className="w-3.5 h-3.5 mr-1.5" />
        <span>Accept</span>
      </Button>
    );
  }

  return (
    <Button
      variant="primary"
      size={size}
      isLoading={isLoading}
      onClick={handleAction}
      className={className}
    >
      <UserPlus className="w-3.5 h-3.5 mr-1.5" />
      <span>Connect</span>
    </Button>
  );
}
