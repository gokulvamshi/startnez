import React, { useState, useEffect, useRef } from 'react';
import { chatService } from '../../services/chatService';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../stores/authStore';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import ChatDateDivider from './ChatDateDivider';
import LoadingSpinner from '../shared/LoadingSpinner';

export default function ChatContainer({ projectId }) {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    try {
      setIsLoading(true);
      const res = await chatService.getMessages(projectId);
      const list = res?.data || res || [];
      setMessages(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error('Failed to load chat messages:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();

    // Supabase Realtime subscription
    let channel;
    try {
      channel = supabase
        .channel(`chat:${projectId}`)
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'project_messages', filter: `project_id=eq.${projectId}` },
          (payload) => {
            const newMsg = payload.new;
            // Only add if not already in state
            setMessages((prev) => {
              if (prev.some((m) => m.id === newMsg.id)) return prev;
              return [...prev, newMsg];
            });
          }
        )
        .subscribe();
    } catch (e) {
      // Offline fallback
    }

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, [projectId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content) => {
    // Optimistic message
    const tempId = `temp-${Date.now()}`;
    const optimisticMsg = {
      id: tempId,
      project_id: projectId,
      sender_id: user?.id,
      sender: {
        id: user?.id,
        full_name: user?.full_name || 'Me',
        avatar_url: user?.avatar_url
      },
      content,
      created_at: new Date().toISOString()
    };

    setMessages((prev) => [...prev, optimisticMsg]);

    try {
      setIsSending(true);
      const res = await chatService.sendMessage(projectId, { content });
      const created = res?.data || res;

      // Replace temp with real response
      setMessages((prev) =>
        prev.map((m) => (m.id === tempId ? created : m))
      );
    } catch (err) {
      console.error('Failed to send message:', err);
      // Revert temp message
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col h-[560px] rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <LoadingSpinner size="md" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 text-slate-400">
            <p className="text-xs font-semibold">Workspace Chat Room</p>
            <p className="text-[11px] mt-1">
              Send links, ideas, and brainstorm hackathon features with your teammates in real-time.
            </p>
          </div>
        ) : (
          <>
            <ChatDateDivider text="Team Conversation" />
            {messages.map((msg) => (
              <ChatMessage
                key={msg.id}
                message={msg}
                isOwn={msg.sender_id === user?.id || msg.sender?.id === user?.id}
              />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Bar */}
      <ChatInput onSendMessage={handleSendMessage} isLoading={isSending} />
    </div>
  );
}
