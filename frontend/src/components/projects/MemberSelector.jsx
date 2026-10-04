import React, { useState, useEffect } from 'react';
import { Check, Search, UserPlus } from 'lucide-react';
import { connectionService } from '../../services/connectionService';
import Avatar from '../shared/Avatar';

export default function MemberSelector({
  selectedMemberIds = [],
  onChange
}) {
  const [connections, setConnections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        setIsLoading(true);
        const res = await connectionService.getConnections();
        const list = res?.data || res || [];
        setConnections(Array.isArray(list) ? list : (list.connections || []));
      } catch (err) {
        console.error('Failed to load connections for project:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConnections();
  }, []);

  const toggleMember = (userId) => {
    if (selectedMemberIds.includes(userId)) {
      onChange(selectedMemberIds.filter((id) => id !== userId));
    } else {
      onChange([...selectedMemberIds, userId]);
    }
  };

  const filtered = connections.filter((c) => {
    const name = c.user?.full_name || c.full_name || '';
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          Invite Teammates from Connections ({selectedMemberIds.length} added)
        </label>
        <span className="text-[11px] text-slate-400">Collaborators get full workspace access</span>
      </div>

      <div className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-2.5">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search your connections..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none"
          />
        </div>

        {isLoading ? (
          <p className="text-xs text-slate-400 text-center py-2">Loading connections...</p>
        ) : filtered.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-2 italic">
            No connected peers found. Connect with builders on the Home page first!
          </p>
        ) : (
          <div className="max-h-36 overflow-y-auto space-y-1 pr-1">
            {filtered.map((item) => {
              const u = item.user || item;
              const isSelected = selectedMemberIds.includes(u.id);

              return (
                <div
                  key={u.id}
                  onClick={() => toggleMember(u.id)}
                  className={`flex items-center justify-between p-2 rounded-xl text-xs cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-primary-50 dark:bg-primary-950/40 border border-primary-200 dark:border-primary-800'
                      : 'hover:bg-white dark:hover:bg-slate-800 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Avatar src={u.avatar_url} name={u.full_name} size="xs" />
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">{u.full_name}</p>
                      <p className="text-[10px] text-slate-400">{u.college || 'Peer'}</p>
                    </div>
                  </div>
                  {isSelected ? (
                    <div className="w-5 h-5 rounded-lg bg-primary-600 text-white flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-lg border border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-400">
                      <UserPlus className="w-3 h-3" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
