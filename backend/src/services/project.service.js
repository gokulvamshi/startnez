const { v4: uuidv4 } = require('uuid');
const { memoryStore, isLiveSupabaseConfigured } = require('./store');
const { supabaseAdmin } = require('../config/supabase');
const notificationService = require('./notification.service');
const { NotFoundError, ForbiddenError, ConflictError } = require('../utils/errors');

class ProjectService {
  async getUserProjects(userId) {
    const memberships = memoryStore.projectMembers.filter(m => m.user_id === userId);
    const projectIds = memberships.map(m => m.project_id);

    const projects = memoryStore.projects.filter(
      p => p.creator_id === userId || projectIds.includes(p.id)
    );

    return projects.map(p => {
      const creator = memoryStore.profiles.find(prof => prof.id === p.creator_id);
      const members = memoryStore.projectMembers
        .filter(m => m.project_id === p.id)
        .map(m => {
          const prof = memoryStore.profiles.find(u => u.id === m.user_id);
          return {
            id: m.user_id,
            full_name: prof?.full_name || 'Member',
            avatar_url: prof?.avatar_url || null,
            role: m.role
          };
        });

      const userRole = memoryStore.projectMembers.find(m => m.project_id === p.id && m.user_id === userId)?.role ||
        (p.creator_id === userId ? 'lead' : 'member');

      return {
        ...p,
        creator: creator ? { id: creator.id, full_name: creator.full_name, avatar_url: creator.avatar_url } : null,
        members,
        user_role: userRole,
        is_creator: p.creator_id === userId
      };
    });
  }

  async getProjectById(projectId, currentUserId) {
    const project = memoryStore.projects.find(p => p.id === projectId);
    if (!project) throw new NotFoundError('Project not found');

    const isMember = memoryStore.projectMembers.some(m => m.project_id === projectId && m.user_id === currentUserId) ||
      project.creator_id === currentUserId;

    if (!isMember) {
      throw new ForbiddenError('You must be a member of this project workspace to view it');
    }

    const creator = memoryStore.profiles.find(p => p.id === project.creator_id);
    const members = memoryStore.projectMembers
      .filter(m => m.project_id === projectId)
      .map(m => {
        const prof = memoryStore.profiles.find(p => p.id === m.user_id);
        return {
          id: m.user_id,
          member_id: m.id,
          full_name: prof?.full_name || 'Team Member',
          avatar_url: prof?.avatar_url || null,
          role: m.role,
          joined_at: m.joined_at
        };
      });

    const userMembership = memoryStore.projectMembers.find(m => m.project_id === projectId && m.user_id === currentUserId);
    const userRole = userMembership?.role || (project.creator_id === currentUserId ? 'lead' : 'member');

    return {
      id: project.id,
      name: project.name,
      description: project.description,
      hackathon_name: project.hackathon_name,
      project_type: project.project_type,
      deadline: project.deadline,
      is_active: project.is_active,
      member_count: members.length,
      created_at: project.created_at,
      creator: creator ? {
        id: creator.id,
        full_name: creator.full_name,
        avatar_url: creator.avatar_url
      } : null,
      members,
      is_creator: project.creator_id === currentUserId,
      user_role: userRole
    };
  }

  async createProject(creatorId, projectData) {
    const newProject = {
      id: uuidv4(),
      creator_id: creatorId,
      name: projectData.name,
      description: projectData.description,
      hackathon_name: projectData.hackathon_name || null,
      project_type: projectData.project_type || 'hackathon',
      deadline: projectData.deadline || null,
      is_active: true,
      member_count: 1 + (projectData.member_ids?.length || 0),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    memoryStore.projects.unshift(newProject);

    // Add creator as lead
    memoryStore.projectMembers.push({
      id: uuidv4(),
      project_id: newProject.id,
      user_id: creatorId,
      role: 'lead',
      joined_at: new Date().toISOString()
    });

    // Add invited members
    if (projectData.member_ids && projectData.member_ids.length > 0) {
      for (const memberId of projectData.member_ids) {
        if (memberId !== creatorId) {
          memoryStore.projectMembers.push({
            id: uuidv4(),
            project_id: newProject.id,
            user_id: memberId,
            role: 'member',
            joined_at: new Date().toISOString()
          });

          // Trigger notification
          const creator = memoryStore.profiles.find(p => p.id === creatorId);
          await notificationService.createNotification({
            recipient_id: memberId,
            sender_id: creatorId,
            type: 'project_invite',
            title: 'Added to Project Workspace',
            message: `${creator?.full_name || 'Your connection'} added you to the project "${newProject.name}".`,
            reference_id: newProject.id,
            reference_type: 'project'
          });
        }
      }
    }

    if (isLiveSupabaseConfigured()) {
      try {
        await supabaseAdmin.from('projects').insert(newProject);
        await supabaseAdmin.from('project_members').insert({
          project_id: newProject.id,
          user_id: creatorId,
          role: 'lead'
        });
      } catch (err) {
        console.error('Supabase createProject error:', err);
      }
    }

    return this.getProjectById(newProject.id, creatorId);
  }

  async updateProject(projectId, userId, updateData) {
    const project = memoryStore.projects.find(p => p.id === projectId);
    if (!project) throw new NotFoundError('Project not found');
    if (project.creator_id !== userId) throw new ForbiddenError('Only the project creator can edit project settings');

    Object.assign(project, updateData, { updated_at: new Date().toISOString() });
    return this.getProjectById(projectId, userId);
  }

  async deleteProject(projectId, userId) {
    const index = memoryStore.projects.findIndex(p => p.id === projectId && p.creator_id === userId);
    if (index === -1) throw new NotFoundError('Project not found or permission denied');

    memoryStore.projects.splice(index, 1);
    memoryStore.projectMembers = memoryStore.projectMembers.filter(m => m.project_id !== projectId);
    return { success: true };
  }

  async addMember(projectId, creatorId, userId, role = 'member') {
    const project = memoryStore.projects.find(p => p.id === projectId);
    if (!project) throw new NotFoundError('Project not found');
    if (project.creator_id !== creatorId) throw new ForbiddenError('Only the project creator can add members');

    const exists = memoryStore.projectMembers.find(m => m.project_id === projectId && m.user_id === userId);
    if (exists) throw new ConflictError('User is already a member of this project');

    const newMember = {
      id: uuidv4(),
      project_id: projectId,
      user_id: userId,
      role,
      joined_at: new Date().toISOString()
    };
    memoryStore.projectMembers.push(newMember);
    project.member_count = (project.member_count || 1) + 1;

    // Trigger notification
    const creator = memoryStore.profiles.find(p => p.id === creatorId);
    await notificationService.createNotification({
      recipient_id: userId,
      sender_id: creatorId,
      type: 'project_invite',
      title: 'Added to Project Workspace',
      message: `${creator?.full_name || 'Your connection'} added you to "${project.name}".`,
      reference_id: projectId,
      reference_type: 'project'
    });

    return newMember;
  }

  async removeMember(projectId, creatorId, userId) {
    const project = memoryStore.projects.find(p => p.id === projectId);
    if (!project) throw new NotFoundError('Project not found');
    if (project.creator_id !== creatorId && creatorId !== userId) {
      throw new ForbiddenError('Permission denied');
    }
    if (userId === project.creator_id) {
      throw new ConflictError('Cannot remove project creator');
    }

    const index = memoryStore.projectMembers.findIndex(m => m.project_id === projectId && m.user_id === userId);
    if (index === -1) throw new NotFoundError('Member not found');

    memoryStore.projectMembers.splice(index, 1);
    project.member_count = Math.max(1, (project.member_count || 1) - 1);
    return { success: true };
  }

  async updateMemberRole(projectId, creatorId, userId, newRole) {
    const project = memoryStore.projects.find(p => p.id === projectId);
    if (!project) throw new NotFoundError('Project not found');
    if (project.creator_id !== creatorId) throw new ForbiddenError('Only project creator can modify roles');

    const member = memoryStore.projectMembers.find(m => m.project_id === projectId && m.user_id === userId);
    if (!member) throw new NotFoundError('Member not found');

    member.role = newRole;
    return member;
  }

  // --- KANBAN METHODS ---
  async getKanbanCards(projectId) {
    const cards = memoryStore.kanbanCards.filter(c => c.project_id === projectId);
    return cards.map(c => {
      const creator = memoryStore.profiles.find(p => p.id === c.created_by);
      const assignee = c.assigned_to ? memoryStore.profiles.find(p => p.id === c.assigned_to) : null;
      return {
        ...c,
        creator: creator ? { id: creator.id, full_name: creator.full_name, avatar_url: creator.avatar_url } : null,
        assignee: assignee ? { id: assignee.id, full_name: assignee.full_name, avatar_url: assignee.avatar_url } : null
      };
    });
  }

  async createKanbanCard(projectId, creatorId, cardData) {
    const newCard = {
      id: uuidv4(),
      project_id: projectId,
      created_by: creatorId,
      assigned_to: cardData.assigned_to || null,
      title: cardData.title,
      description: cardData.description || null,
      status: cardData.status || 'todo',
      priority: cardData.priority !== undefined ? cardData.priority : 0,
      display_order: cardData.display_order || 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    memoryStore.kanbanCards.push(newCard);
    return newCard;
  }

  async updateKanbanCard(cardId, updateData) {
    const card = memoryStore.kanbanCards.find(c => c.id === cardId);
    if (!card) throw new NotFoundError('Kanban card not found');

    Object.assign(card, updateData, { updated_at: new Date().toISOString() });
    return card;
  }

  async deleteKanbanCard(cardId) {
    const index = memoryStore.kanbanCards.findIndex(c => c.id === cardId);
    if (index === -1) throw new NotFoundError('Kanban card not found');
    memoryStore.kanbanCards.splice(index, 1);
    return { success: true };
  }

  // --- PROJECT FILES ---
  async getProjectFiles(projectId) {
    const files = memoryStore.projectFiles.filter(f => f.project_id === projectId);
    return files.map(f => {
      const uploader = memoryStore.profiles.find(p => p.id === f.uploaded_by);
      return {
        ...f,
        uploader: uploader ? { id: uploader.id, full_name: uploader.full_name, avatar_url: uploader.avatar_url } : null
      };
    });
  }

  async addProjectFile(projectId, uploaderId, fileData) {
    const newFile = {
      id: uuidv4(),
      project_id: projectId,
      uploaded_by: uploaderId,
      file_name: fileData.file_name,
      file_url: fileData.file_url,
      file_size: fileData.file_size || 0,
      file_type: fileData.file_type || 'application/octet-stream',
      created_at: new Date().toISOString()
    };
    memoryStore.projectFiles.unshift(newFile);
    return newFile;
  }

  async deleteProjectFile(fileId, userId) {
    const index = memoryStore.projectFiles.findIndex(f => f.id === fileId);
    if (index === -1) throw new NotFoundError('File not found');
    memoryStore.projectFiles.splice(index, 1);
    return { success: true };
  }

  // --- CHAT MESSAGES ---
  async getMessages(projectId, cursor = null, limit = 50) {
    const messages = memoryStore.projectMessages
      .filter(m => m.project_id === projectId)
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

    return messages.map(m => {
      const sender = memoryStore.profiles.find(p => p.id === m.sender_id);
      return {
        ...m,
        sender: sender ? { id: sender.id, full_name: sender.full_name, avatar_url: sender.avatar_url } : null
      };
    });
  }

  async sendMessage(projectId, senderId, messageData) {
    const newMessage = {
      id: uuidv4(),
      project_id: projectId,
      sender_id: senderId,
      content: messageData.content,
      message_type: messageData.message_type || 'text',
      file_url: messageData.file_url || null,
      is_edited: false,
      created_at: new Date().toISOString()
    };

    memoryStore.projectMessages.push(newMessage);
    const sender = memoryStore.profiles.find(p => p.id === senderId);

    return {
      ...newMessage,
      sender: sender ? { id: sender.id, full_name: sender.full_name, avatar_url: sender.avatar_url } : null
    };
  }

  // --- LINKS ---
  async getLinks(projectId) {
    const links = memoryStore.projectLinks.filter(l => l.project_id === projectId);
    return links.map(l => {
      const addedBy = memoryStore.profiles.find(p => p.id === l.added_by);
      return {
        ...l,
        added_by_user: addedBy ? { id: addedBy.id, full_name: addedBy.full_name } : null
      };
    });
  }

  async addLink(projectId, userId, linkData) {
    const newLink = {
      id: uuidv4(),
      project_id: projectId,
      added_by: userId,
      title: linkData.title,
      url: linkData.url,
      description: linkData.description || null,
      created_at: new Date().toISOString()
    };
    memoryStore.projectLinks.unshift(newLink);
    return newLink;
  }

  async updateLink(linkId, updateData) {
    const link = memoryStore.projectLinks.find(l => l.id === linkId);
    if (!link) throw new NotFoundError('Link not found');
    Object.assign(link, updateData);
    return link;
  }

  async deleteLink(linkId) {
    const index = memoryStore.projectLinks.findIndex(l => l.id === linkId);
    if (index === -1) throw new NotFoundError('Link not found');
    memoryStore.projectLinks.splice(index, 1);
    return { success: true };
  }

  // --- NOTES ---
  async getNotes(projectId) {
    const notes = memoryStore.projectNotes.filter(n => n.project_id === projectId);
    return notes.map(n => {
      const editor = n.last_edited_by ? memoryStore.profiles.find(p => p.id === n.last_edited_by) : null;
      return {
        ...n,
        editor: editor ? { id: editor.id, full_name: editor.full_name } : null
      };
    });
  }

  async createNote(projectId, userId, noteData) {
    const newNote = {
      id: uuidv4(),
      project_id: projectId,
      title: noteData.title || 'Untitled Note',
      content: noteData.content || '',
      last_edited_by: userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    memoryStore.projectNotes.unshift(newNote);
    return newNote;
  }

  async updateNote(noteId, userId, noteData) {
    const note = memoryStore.projectNotes.find(n => n.id === noteId);
    if (!note) throw new NotFoundError('Note not found');
    Object.assign(note, noteData, {
      last_edited_by: userId,
      updated_at: new Date().toISOString()
    });
    return note;
  }

  async deleteNote(noteId) {
    const index = memoryStore.projectNotes.findIndex(n => n.id === noteId);
    if (index === -1) throw new NotFoundError('Note not found');
    memoryStore.projectNotes.splice(index, 1);
    return { success: true };
  }
}

module.exports = new ProjectService();
