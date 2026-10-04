const { v4: uuidv4 } = require('uuid');
const { memoryStore, isLiveSupabaseConfigured } = require('./store');
const { supabaseAdmin } = require('../config/supabase');
const notificationService = require('./notification.service');
const { NotFoundError, ForbiddenError, ConflictError } = require('../utils/errors');

class StartupService {
  async getStartups(currentUserId, query = {}) {
    const page = Math.max(1, parseInt(query.page || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(query.limit || '12', 10)));
    const stage = query.stage && query.stage !== 'all' ? query.stage : null;
    const techStack = query.techStack ? query.techStack.split(',').map(t => t.trim().toLowerCase()) : [];
    const roleNeeded = query.role && query.role !== 'all' ? query.role.toLowerCase() : null;
    const search = query.search ? query.search.trim().toLowerCase() : null;

    let startups = memoryStore.startups.filter(s => s.is_active);

    if (stage) {
      startups = startups.filter(s => s.stage === stage);
    }

    if (techStack.length > 0) {
      startups = startups.filter(s => s.tech_stack && s.tech_stack.some(ts => techStack.includes(ts.toLowerCase())));
    }

    if (roleNeeded) {
      startups = startups.filter(s => s.roles_needed && s.roles_needed.some(r => r.toLowerCase().includes(roleNeeded)));
    }

    if (search) {
      startups = startups.filter(s =>
        s.name.toLowerCase().includes(search) ||
        s.one_liner.toLowerCase().includes(search) ||
        s.problem_statement.toLowerCase().includes(search)
      );
    }

    const total = startups.length;
    const start = (page - 1) * limit;
    const slice = startups.slice(start, start + limit);

    const formattedStartups = slice.map(s => {
      const founder = memoryStore.profiles.find(p => p.id === s.founder_id);
      return {
        ...s,
        founder: founder ? {
          id: founder.id,
          full_name: founder.full_name,
          avatar_url: founder.avatar_url,
          college: founder.college,
          year_of_study: founder.year_of_study
        } : null
      };
    });

    return {
      startups: formattedStartups,
      pagination: {
        page,
        limit,
        total,
        has_more: start + limit < total
      }
    };
  }

  async getStartupById(startupId, currentUserId = null) {
    const startup = memoryStore.startups.find(s => s.id === startupId);
    if (!startup) throw new NotFoundError('Startup not found');

    const founder = memoryStore.profiles.find(p => p.id === startup.founder_id);
    const members = memoryStore.startupMembers.filter(m => m.startup_id === startupId);

    const team = members.map(m => {
      const profile = memoryStore.profiles.find(p => p.id === m.user_id);
      return {
        id: m.user_id,
        member_id: m.id,
        full_name: profile?.full_name || 'Team Member',
        avatar_url: profile?.avatar_url || null,
        college: profile?.college || '',
        role: m.role,
        is_founder: m.is_founder
      };
    });

    // Check current user application status
    let userAppStatus = 'none';
    if (currentUserId) {
      const userApp = memoryStore.startupApplications.find(
        a => a.startup_id === startupId && a.applicant_id === currentUserId
      );
      if (userApp) userAppStatus = userApp.status;
    }

    return {
      id: startup.id,
      name: startup.name,
      one_liner: startup.one_liner,
      problem_statement: startup.problem_statement,
      solution: startup.solution,
      description: startup.description,
      tech_stack: startup.tech_stack || [],
      roles_needed: startup.roles_needed || [],
      stage: startup.stage,
      logo_url: startup.logo_url,
      website_url: startup.website_url,
      application_count: startup.application_count || 0,
      member_count: startup.member_count || team.length,
      is_active: startup.is_active,
      created_at: startup.created_at,
      founder: founder ? {
        id: founder.id,
        full_name: founder.full_name,
        avatar_url: founder.avatar_url,
        college: founder.college,
        year_of_study: founder.year_of_study
      } : null,
      team,
      user_application_status: userAppStatus,
      is_founder: currentUserId === startup.founder_id
    };
  }

  async createStartup(founderId, startupData) {
    const newStartup = {
      id: uuidv4(),
      founder_id: founderId,
      name: startupData.name,
      one_liner: startupData.one_liner,
      problem_statement: startupData.problem_statement,
      solution: startupData.solution,
      description: startupData.description || null,
      tech_stack: startupData.tech_stack || [],
      roles_needed: startupData.roles_needed || [],
      stage: startupData.stage || 'idea',
      logo_url: startupData.logo_url || null,
      website_url: startupData.website_url || null,
      application_count: 0,
      member_count: 1,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    memoryStore.startups.unshift(newStartup);

    // Add founder to startup_members
    memoryStore.startupMembers.push({
      id: uuidv4(),
      startup_id: newStartup.id,
      user_id: founderId,
      role: 'Founder',
      is_founder: true,
      joined_at: new Date().toISOString()
    });

    if (isLiveSupabaseConfigured()) {
      try {
        await supabaseAdmin.from('startups').insert(newStartup);
        await supabaseAdmin.from('startup_members').insert({
          startup_id: newStartup.id,
          user_id: founderId,
          role: 'Founder',
          is_founder: true
        });
      } catch (err) {
        console.error('Supabase createStartup error:', err);
      }
    }

    return this.getStartupById(newStartup.id, founderId);
  }

  async updateStartup(startupId, founderId, updateData) {
    const startup = memoryStore.startups.find(s => s.id === startupId);
    if (!startup) throw new NotFoundError('Startup not found');
    if (startup.founder_id !== founderId) throw new ForbiddenError('Only the founder can update this startup');

    Object.assign(startup, updateData, { updated_at: new Date().toISOString() });

    if (isLiveSupabaseConfigured()) {
      try {
        await supabaseAdmin.from('startups').update(updateData).eq('id', startupId);
      } catch (err) {
        console.error('Supabase updateStartup error:', err);
      }
    }

    return this.getStartupById(startupId, founderId);
  }

  async deleteStartup(startupId, founderId) {
    const index = memoryStore.startups.findIndex(s => s.id === startupId && s.founder_id === founderId);
    if (index === -1) throw new NotFoundError('Startup not found or permission denied');

    memoryStore.startups.splice(index, 1);

    if (isLiveSupabaseConfigured()) {
      try {
        await supabaseAdmin.from('startups').delete().eq('id', startupId);
      } catch (err) {
        console.error('Supabase deleteStartup error:', err);
      }
    }

    return { success: true };
  }

  async applyToStartup(startupId, applicantId, applicationData) {
    const startup = memoryStore.startups.find(s => s.id === startupId);
    if (!startup) throw new NotFoundError('Startup not found');
    if (startup.founder_id === applicantId) throw new ConflictError('Founders cannot apply to their own startup');

    // Check existing
    const existing = memoryStore.startupApplications.find(
      a => a.startup_id === startupId && a.applicant_id === applicantId
    );
    if (existing) {
      if (existing.status === 'pending') throw new ConflictError('You already have a pending application');
      if (existing.status === 'accepted') throw new ConflictError('You are already an accepted team member');
    }

    const newApplication = {
      id: uuidv4(),
      startup_id: startupId,
      applicant_id: applicantId,
      message: applicationData.message || null,
      role_applied_for: applicationData.role_applied_for || null,
      status: 'pending',
      reviewed_at: null,
      created_at: new Date().toISOString()
    };

    memoryStore.startupApplications.push(newApplication);
    startup.application_count = (startup.application_count || 0) + 1;

    // Trigger notification to founder
    const applicant = memoryStore.profiles.find(p => p.id === applicantId);
    await notificationService.createNotification({
      recipient_id: startup.founder_id,
      sender_id: applicantId,
      type: 'startup_application',
      title: 'New Startup Co-founder Application',
      message: `${applicant?.full_name || 'A student'} applied to join "${startup.name}" for ${applicationData.role_applied_for || 'open role'}.`,
      reference_id: startupId,
      reference_type: 'startup'
    });

    return newApplication;
  }

  async getApplications(startupId, founderId) {
    const startup = memoryStore.startups.find(s => s.id === startupId);
    if (!startup) throw new NotFoundError('Startup not found');
    if (startup.founder_id !== founderId) throw new ForbiddenError('Only the founder can view applications');

    const applications = memoryStore.startupApplications.filter(a => a.startup_id === startupId);
    return applications.map(app => {
      const applicant = memoryStore.profiles.find(p => p.id === app.applicant_id);
      const applicantSkills = memoryStore.skills.filter(s => s.user_id === app.applicant_id);

      return {
        id: app.id,
        startup_id: app.startup_id,
        role_applied_for: app.role_applied_for,
        message: app.message,
        status: app.status,
        created_at: app.created_at,
        applicant: applicant ? {
          id: applicant.id,
          full_name: applicant.full_name,
          avatar_url: applicant.avatar_url,
          college: applicant.college,
          year_of_study: applicant.year_of_study,
          bio: applicant.bio,
          skills: applicantSkills.map(s => ({ skill_name: s.skill_name, proficiency: s.proficiency }))
        } : null
      };
    });
  }

  async reviewApplication(applicationId, founderId, status) {
    const app = memoryStore.startupApplications.find(a => a.id === applicationId);
    if (!app) throw new NotFoundError('Application not found');

    const startup = memoryStore.startups.find(s => s.id === app.startup_id);
    if (!startup) throw new NotFoundError('Startup not found');
    if (startup.founder_id !== founderId) throw new ForbiddenError('Only founder can review applications');

    app.status = status;
    app.reviewed_at = new Date().toISOString();

    // If accepted, add to startup_members
    if (status === 'accepted') {
      const existingMember = memoryStore.startupMembers.find(
        m => m.startup_id === startup.id && m.user_id === app.applicant_id
      );
      if (!existingMember) {
        memoryStore.startupMembers.push({
          id: uuidv4(),
          startup_id: startup.id,
          user_id: app.applicant_id,
          role: app.role_applied_for || 'Core Contributor',
          is_founder: false,
          joined_at: new Date().toISOString()
        });
        startup.member_count = (startup.member_count || 1) + 1;
      }
    }

    // Trigger notification to applicant
    await notificationService.createNotification({
      recipient_id: app.applicant_id,
      sender_id: founderId,
      type: status === 'accepted' ? 'startup_application_accepted' : 'startup_application_rejected',
      title: status === 'accepted' ? 'Startup Application Accepted! 🎉' : 'Startup Application Update',
      message: status === 'accepted'
        ? `Congratulations! You have been accepted to join the team at "${startup.name}"!`
        : `Your application to join "${startup.name}" was not selected at this time.`,
      reference_id: startup.id,
      reference_type: 'startup'
    });

    return app;
  }

  async removeMember(memberId, founderId) {
    const memberIndex = memoryStore.startupMembers.findIndex(m => m.id === memberId);
    if (memberIndex === -1) throw new NotFoundError('Member not found');

    const member = memoryStore.startupMembers[memberIndex];
    const startup = memoryStore.startups.find(s => s.id === member.startup_id);
    if (!startup) throw new NotFoundError('Startup not found');
    if (startup.founder_id !== founderId) throw new ForbiddenError('Only founder can remove members');
    if (member.is_founder) throw new ConflictError('Cannot remove founder');

    memoryStore.startupMembers.splice(memberIndex, 1);
    startup.member_count = Math.max(1, (startup.member_count || 1) - 1);
    return { success: true };
  }

  async getUserStartups(userId) {
    // Startups founded or member of
    const memberStartups = memoryStore.startupMembers.filter(m => m.user_id === userId).map(m => m.startup_id);
    const startups = memoryStore.startups.filter(s => s.founder_id === userId || memberStartups.includes(s.id));

    return startups.map(s => {
      const founder = memoryStore.profiles.find(p => p.id === s.founder_id);
      return {
        ...s,
        founder: founder ? { id: founder.id, full_name: founder.full_name, avatar_url: founder.avatar_url } : null,
        is_founder: s.founder_id === userId
      };
    });
  }
}

module.exports = new StartupService();
