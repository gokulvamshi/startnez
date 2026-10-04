const { v4: uuidv4 } = require('uuid');
const { memoryStore, isLiveSupabaseConfigured } = require('./store');
const { supabaseAdmin } = require('../config/supabase');

class NotificationService {
  async createNotification({ recipient_id, sender_id, type, title, message = null, reference_id = null, reference_type = null }) {
    if (!recipient_id || recipient_id === sender_id) {
      return null;
    }

    const notificationPayload = {
      id: uuidv4(),
      recipient_id,
      sender_id,
      type,
      title,
      message,
      reference_id,
      reference_type,
      is_read: false,
      created_at: new Date().toISOString()
    };

    if (isLiveSupabaseConfigured()) {
      try {
        const { data, error } = await supabaseAdmin
          .from('notifications')
          .insert(notificationPayload)
          .select()
          .single();
        if (error) console.error('Supabase createNotification error:', error);
        return data || notificationPayload;
      } catch (err) {
        console.error('Error inserting Supabase notification:', err);
      }
    }

    memoryStore.notifications.unshift(notificationPayload);
    return notificationPayload;
  }

  async getUserNotifications(userId, page = 1, limit = 20) {
    if (isLiveSupabaseConfigured()) {
      try {
        const from = (page - 1) * limit;
        const to = from + limit - 1;

        const { data, error, count } = await supabaseAdmin
          .from('notifications')
          .select(`
            *,
            sender:profiles!sender_id (id, full_name, avatar_url)
          `, { count: 'exact' })
          .eq('recipient_id', userId)
          .order('created_at', { ascending: false })
          .range(from, to);

        if (!error && data) {
          const { count: unreadCount } = await supabaseAdmin
            .from('notifications')
            .select('*', { count: 'exact', head: true })
            .eq('recipient_id', userId)
            .eq('is_read', false);

          return {
            notifications: data,
            unread_count: unreadCount || 0,
            pagination: {
              page,
              limit,
              total: count || data.length,
              has_more: to < (count || 0)
            }
          };
        }
      } catch (err) {
        console.error('Error fetching Supabase notifications:', err);
      }
    }

    const userNotifs = memoryStore.notifications.filter(n => n.recipient_id === userId);
    const total = userNotifs.length;
    const unreadCount = userNotifs.filter(n => !n.is_read).length;
    const start = (page - 1) * limit;
    const slice = userNotifs.slice(start, start + limit).map(n => {
      const sender = memoryStore.profiles.find(p => p.id === n.sender_id);
      return {
        ...n,
        sender: sender ? { id: sender.id, full_name: sender.full_name, avatar_url: sender.avatar_url } : null
      };
    });

    return {
      notifications: slice,
      unread_count: unreadCount,
      pagination: {
        page,
        limit,
        total,
        has_more: start + limit < total
      }
    };
  }

  async markAsRead(notificationId, userId) {
    if (isLiveSupabaseConfigured()) {
      try {
        await supabaseAdmin
          .from('notifications')
          .update({ is_read: true })
          .eq('id', notificationId)
          .eq('recipient_id', userId);
      } catch (err) {
        console.error('Error marking notification as read in Supabase:', err);
      }
    }

    const notif = memoryStore.notifications.find(n => n.id === notificationId && n.recipient_id === userId);
    if (notif) {
      notif.is_read = true;
    }
    return { success: true };
  }

  async markAllAsRead(userId) {
    if (isLiveSupabaseConfigured()) {
      try {
        await supabaseAdmin
          .from('notifications')
          .update({ is_read: true })
          .eq('recipient_id', userId);
      } catch (err) {
        console.error('Error marking all notifications as read in Supabase:', err);
      }
    }

    memoryStore.notifications
      .filter(n => n.recipient_id === userId)
      .forEach(n => { n.is_read = true; });

    return { success: true };
  }

  async deleteNotification(notificationId, userId) {
    if (isLiveSupabaseConfigured()) {
      try {
        await supabaseAdmin
          .from('notifications')
          .delete()
          .eq('id', notificationId)
          .eq('recipient_id', userId);
      } catch (err) {
        console.error('Error deleting notification in Supabase:', err);
      }
    }

    const index = memoryStore.notifications.findIndex(n => n.id === notificationId && n.recipient_id === userId);
    if (index !== -1) {
      memoryStore.notifications.splice(index, 1);
    }
    return { success: true };
  }
}

module.exports = new NotificationService();
