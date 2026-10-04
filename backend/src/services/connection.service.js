const { v4: uuidv4 } = require('uuid');
const { memoryStore, isLiveSupabaseConfigured } = require('./store');
const { supabaseAdmin } = require('../config/supabase');
const notificationService = require('./notification.service');
const { ConflictError, NotFoundError, ForbiddenError } = require('../utils/errors');

class ConnectionService {
  async sendRequest(requesterId, receiverId) {
    if (requesterId === receiverId) {
      throw new ConflictError('Cannot connect with yourself');
    }

    // Check existing
    const existing = memoryStore.connections.find(
      c => (c.requester_id === requesterId && c.receiver_id === receiverId) ||
           (c.requester_id === receiverId && c.receiver_id === requesterId)
    );

    if (existing) {
      if (existing.status === 'accepted') throw new ConflictError('Already connected');
      if (existing.status === 'pending') throw new ConflictError('Connection request is already pending');
    }

    const newConnection = {
      id: uuidv4(),
      requester_id: requesterId,
      receiver_id: receiverId,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (isLiveSupabaseConfigured()) {
      try {
        await supabaseAdmin.from('connections').insert(newConnection);
      } catch (err) {
        console.error('Supabase sendRequest error:', err);
      }
    }

    memoryStore.connections.push(newConnection);

    // Trigger Notification to Receiver
    const requester = memoryStore.profiles.find(p => p.id === requesterId);
    await notificationService.createNotification({
      recipient_id: receiverId,
      sender_id: requesterId,
      type: 'connection_request',
      title: 'New Connection Request',
      message: `${requester?.full_name || 'A builder'} sent you a connection request.`,
      reference_id: newConnection.id,
      reference_type: 'connection'
    });

    return newConnection;
  }

  async acceptRequest(connectionId, userId) {
    const conn = memoryStore.connections.find(c => c.id === connectionId);
    if (!conn) throw new NotFoundError('Connection request not found');

    if (conn.receiver_id !== userId) {
      throw new ForbiddenError('Only the recipient can accept this connection request');
    }

    conn.status = 'accepted';
    conn.updated_at = new Date().toISOString();

    // Increment connection counts
    const requester = memoryStore.profiles.find(p => p.id === conn.requester_id);
    const receiver = memoryStore.profiles.find(p => p.id === conn.receiver_id);
    if (requester) requester.connection_count = (requester.connection_count || 0) + 1;
    if (receiver) receiver.connection_count = (receiver.connection_count || 0) + 1;

    if (isLiveSupabaseConfigured()) {
      try {
        await supabaseAdmin
          .from('connections')
          .update({ status: 'accepted', updated_at: conn.updated_at })
          .eq('id', connectionId);
      } catch (err) {
        console.error('Supabase acceptRequest error:', err);
      }
    }

    // Trigger Notification to Requester
    await notificationService.createNotification({
      recipient_id: conn.requester_id,
      sender_id: userId,
      type: 'connection_accepted',
      title: 'Connection Accepted',
      message: `${receiver?.full_name || 'Your peer'} accepted your connection request!`,
      reference_id: conn.id,
      reference_type: 'connection'
    });

    return conn;
  }

  async rejectRequest(connectionId, userId) {
    const conn = memoryStore.connections.find(c => c.id === connectionId);
    if (!conn) throw new NotFoundError('Connection request not found');

    if (conn.receiver_id !== userId) {
      throw new ForbiddenError('Only the recipient can reject this request');
    }

    conn.status = 'rejected';
    conn.updated_at = new Date().toISOString();

    if (isLiveSupabaseConfigured()) {
      try {
        await supabaseAdmin
          .from('connections')
          .update({ status: 'rejected', updated_at: conn.updated_at })
          .eq('id', connectionId);
      } catch (err) {
        console.error('Supabase rejectRequest error:', err);
      }
    }

    return conn;
  }

  async removeConnection(connectionId, userId) {
    const index = memoryStore.connections.findIndex(
      c => c.id === connectionId && (c.requester_id === userId || c.receiver_id === userId)
    );
    if (index === -1) throw new NotFoundError('Connection not found or permission denied');

    const conn = memoryStore.connections[index];
    memoryStore.connections.splice(index, 1);

    if (conn.status === 'accepted') {
      const requester = memoryStore.profiles.find(p => p.id === conn.requester_id);
      const receiver = memoryStore.profiles.find(p => p.id === conn.receiver_id);
      if (requester) requester.connection_count = Math.max(0, (requester.connection_count || 0) - 1);
      if (receiver) receiver.connection_count = Math.max(0, (receiver.connection_count || 0) - 1);
    }

    if (isLiveSupabaseConfigured()) {
      try {
        await supabaseAdmin.from('connections').delete().eq('id', connectionId);
      } catch (err) {
        console.error('Supabase removeConnection error:', err);
      }
    }

    return { success: true };
  }

  async getUserConnections(userId, page = 1, limit = 20) {
    const acceptedConns = memoryStore.connections.filter(
      c => c.status === 'accepted' && (c.requester_id === userId || c.receiver_id === userId)
    );

    const total = acceptedConns.length;
    const start = (page - 1) * limit;
    const slice = acceptedConns.slice(start, start + limit);

    const connectedProfiles = slice.map(c => {
      const otherId = c.requester_id === userId ? c.receiver_id : c.requester_id;
      const profile = memoryStore.profiles.find(p => p.id === otherId);
      const skills = memoryStore.skills.filter(s => s.user_id === otherId && s.is_primary);
      return {
        connection_id: c.id,
        connected_at: c.updated_at,
        profile: profile ? {
          id: profile.id,
          full_name: profile.full_name,
          avatar_url: profile.avatar_url,
          college: profile.college,
          year_of_study: profile.year_of_study,
          bio: profile.bio,
          primary_skills: skills.map(s => ({ skill_name: s.skill_name, proficiency: s.proficiency }))
        } : null
      };
    }).filter(c => c.profile !== null);

    return {
      connections: connectedProfiles,
      pagination: {
        page,
        limit,
        total,
        has_more: start + limit < total
      }
    };
  }

  async getPendingRequests(userId) {
    const requests = memoryStore.connections.filter(
      c => c.status === 'pending' && c.receiver_id === userId
    );

    return requests.map(c => {
      const requester = memoryStore.profiles.find(p => p.id === c.requester_id);
      const skills = memoryStore.skills.filter(s => s.user_id === c.requester_id);
      return {
        connection_id: c.id,
        created_at: c.created_at,
        requester: requester ? {
          id: requester.id,
          full_name: requester.full_name,
          avatar_url: requester.avatar_url,
          college: requester.college,
          year_of_study: requester.year_of_study,
          bio: requester.bio,
          skills: skills.slice(0, 3).map(s => s.skill_name)
        } : null
      };
    });
  }

  async getSentRequests(userId) {
    const sent = memoryStore.connections.filter(
      c => c.status === 'pending' && c.requester_id === userId
    );

    return sent.map(c => {
      const receiver = memoryStore.profiles.find(p => p.id === c.receiver_id);
      return {
        connection_id: c.id,
        created_at: c.created_at,
        receiver: receiver ? {
          id: receiver.id,
          full_name: receiver.full_name,
          avatar_url: receiver.avatar_url,
          college: receiver.college
        } : null
      };
    });
  }

  async checkStatus(userId, otherUserId) {
    const conn = memoryStore.connections.find(
      c => (c.requester_id === userId && c.receiver_id === otherUserId) ||
           (c.requester_id === otherUserId && c.receiver_id === userId)
    );

    if (!conn) return { status: 'none', connection_id: null };

    if (conn.status === 'accepted') {
      return { status: 'connected', connection_id: conn.id };
    }
    if (conn.status === 'pending') {
      return {
        status: conn.requester_id === userId ? 'pending_sent' : 'pending_received',
        connection_id: conn.id
      };
    }
    return { status: conn.status, connection_id: conn.id };
  }
}

module.exports = new ConnectionService();
