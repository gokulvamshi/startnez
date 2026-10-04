import React, { useState, useEffect } from 'react';
import { Users, UserCheck, Inbox, Send } from 'lucide-react';
import { connectionService } from '../services/connectionService';
import ConnectionsList from '../components/connections/ConnectionsList';
import ConnectionRequestCard from '../components/connections/ConnectionRequestCard';
import SentRequestCard from '../components/connections/SentRequestCard';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import Card from '../components/shared/Card';
import SEOHead from '../components/shared/SEOHead';

export default function ConnectionsPage() {
  const [activeTab, setActiveTab] = useState('connected');
  const [connections, setConnections] = useState([]);
  const [requests, setRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [connRes, reqRes, sentRes] = await Promise.all([
        connectionService.getConnections(),
        connectionService.getRequests(),
        connectionService.getSentRequests()
      ]);

      const connList = connRes?.data || connRes || [];
      const reqList = reqRes?.data || reqRes || [];
      const sentList = sentRes?.data || sentRes || [];

      setConnections(Array.isArray(connList) ? connList : (connList.connections || []));
      setRequests(Array.isArray(reqList) ? reqList : []);
      setSentRequests(Array.isArray(sentList) ? sentList : []);
    } catch (err) {
      console.error('Failed to load connections data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAcceptRequest = async (id) => {
    await connectionService.acceptRequest(id);
    fetchData();
  };

  const handleRejectRequest = async (id) => {
    await connectionService.rejectRequest(id);
    setRequests((prev) => prev.filter((r) => r.id !== id));
  };

  const handleWithdrawRequest = async (id) => {
    await connectionService.removeConnection(id);
    setSentRequests((prev) => prev.filter((r) => r.id !== id));
  };

  const handleRemoveConnection = async (id) => {
    if (!window.confirm('Remove this builder from your connections?')) return;
    await connectionService.removeConnection(id);
    setConnections((prev) => prev.filter((c) => c.id !== id));
  };

  const TABS = [
    { id: 'connected', label: 'My Connections', count: connections.length, icon: UserCheck },
    { id: 'received', label: 'Requests Received', count: requests.length, icon: Inbox },
    { id: 'sent', label: 'Requests Sent', count: sentRequests.length, icon: Send }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-4">
      <SEOHead title="Manage Connections — HackConnect" />

      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
          <Users className="w-6 h-6 text-primary-500" />
          <span>Campus Network & Connections</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Manage your accepted teammates, pending incoming requests, and sent invites.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${isActive ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-800'}`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="md" />
        </div>
      ) : (
        <div>
          {activeTab === 'connected' && (
            <ConnectionsList
              connections={connections}
              onRemoveConnection={handleRemoveConnection}
            />
          )}

          {activeTab === 'received' && (
            <div className="space-y-3">
              {requests.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-6">
                  <p className="text-xs text-slate-500">No pending connection requests received.</p>
                </div>
              ) : (
                requests.map((req) => (
                  <ConnectionRequestCard
                    key={req.id}
                    request={req}
                    onAccept={handleAcceptRequest}
                    onReject={handleRejectRequest}
                  />
                ))
              )}
            </div>
          )}

          {activeTab === 'sent' && (
            <div className="space-y-3">
              {sentRequests.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-6">
                  <p className="text-xs text-slate-500">No pending requests sent.</p>
                </div>
              ) : (
                sentRequests.map((req) => (
                  <SentRequestCard
                    key={req.id}
                    request={req}
                    onWithdraw={handleWithdrawRequest}
                  />
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
