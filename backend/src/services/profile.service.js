const { v4: uuidv4 } = require('uuid');
const { memoryStore, isLiveSupabaseConfigured } = require('./store');
const { supabaseAdmin } = require('../config/supabase');
const recommendationService = require('./recommendation.service');

class ProfileService {
  calculateCompleteness(profile, skills = []) {
    let score = 0;
    if (profile.full_name) score += 15;
    if (profile.college) score += 15;
    if (profile.year_of_study) score += 10;
    if (profile.avatar_url) score += 10;
    if (profile.bio && profile.bio.length >= 20) score += 20;
    if (profile.looking_for && profile.looking_for.length > 0) score += 10;
    if (skills.length >= 3) score += 10;
    else if (skills.length >= 1) score += 5;
    if (profile.github_url || profile.portfolio_url || profile.twitter_url || profile.linkedin_url) score += 10;
    return Math.min(100, score);
  }

  async getProfileById(userId, currentUserId = null) {
    if (isLiveSupabaseConfigured()) {
      try {
        const { data: profile, error } = await supabaseAdmin
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (error || !profile) return null;

        const { data: skills } = await supabaseAdmin
          .from('user_skills')
          .select('*')
          .eq('user_id', userId)
          .order('display_order', { ascending: true });

        let connectionStatus = 'none';
        if (currentUserId && currentUserId !== userId) {
          const { data: conn } = await supabaseAdmin
            .from('connections')
            .select('*')
            .or(`and(requester_id.eq.${currentUserId},receiver_id.eq.${userId}),and(requester_id.eq.${userId},receiver_id.eq.${currentUserId})`)
            .maybeSingle();

          if (conn) {
            if (conn.status === 'accepted') connectionStatus = 'connected';
            else if (conn.status === 'pending') {
              connectionStatus = conn.requester_id === currentUserId ? 'pending_sent' : 'pending_received';
            }
          }
        }

        return {
          ...profile,
          skills: skills || [],
          connection_status: connectionStatus,
          is_own: currentUserId === userId
        };
      } catch (err) {
        console.error('Supabase getProfileById error:', err);
      }
    }

    const profile = memoryStore.profiles.find(p => p.id === userId);
    if (!profile) return null;

    const skills = memoryStore.skills.filter(s => s.user_id === userId);

    let connectionStatus = 'none';
    if (currentUserId && currentUserId !== userId) {
      const conn = memoryStore.connections.find(c =>
        (c.requester_id === currentUserId && c.receiver_id === userId) ||
        (c.requester_id === userId && c.receiver_id === currentUserId)
      );

      if (conn) {
        if (conn.status === 'accepted') connectionStatus = 'connected';
        else if (conn.status === 'pending') {
          connectionStatus = conn.requester_id === currentUserId ? 'pending_sent' : 'pending_received';
        }
      }
    }

    return {
      ...profile,
      skills,
      connection_status: connectionStatus,
      is_own: currentUserId === userId
    };
  }

  async discoverProfiles(currentUserId, query = {}) {
    const page = Math.max(1, parseInt(query.page || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(query.limit || '20', 10)));
    const skillFilter = query.skills ? query.skills.split(',').map(s => s.trim().toLowerCase()) : [];
    const yearFilter = query.year && query.year !== 'all' ? query.year : null;
    const collegeFilter = query.college && query.college !== 'all' ? query.college.toLowerCase() : null;
    const lookingForFilter = query.lookingFor && query.lookingFor !== 'all' ? query.lookingFor : null;
    const searchQuery = query.search ? query.search.trim().toLowerCase() : null;

    let currentUser = null;
    let currentUserSkills = [];
    if (currentUserId) {
      currentUser = memoryStore.profiles.find(p => p.id === currentUserId);
      currentUserSkills = memoryStore.skills.filter(s => s.user_id === currentUserId);
    }

    let candidates = memoryStore.profiles.filter(p => p.id !== currentUserId && p.is_onboarded);

    // Apply Filters
    if (yearFilter) {
      candidates = candidates.filter(p => p.year_of_study && p.year_of_study.toLowerCase().includes(yearFilter.toLowerCase()));
    }
    if (collegeFilter) {
      candidates = candidates.filter(p => p.college && p.college.toLowerCase().includes(collegeFilter));
    }
    if (lookingForFilter) {
      candidates = candidates.filter(p => p.looking_for && p.looking_for.some(lf => lf.toLowerCase().includes(lookingForFilter.toLowerCase())));
    }
    if (searchQuery) {
      candidates = candidates.filter(p => {
        const matchesName = p.full_name && p.full_name.toLowerCase().includes(searchQuery);
        const matchesCollege = p.college && p.college.toLowerCase().includes(searchQuery);
        const candidateSkills = memoryStore.skills.filter(s => s.user_id === p.id);
        const matchesSkill = candidateSkills.some(s => s.skill_name.toLowerCase().includes(searchQuery));
        return matchesName || matchesCollege || matchesSkill;
      });
    }

    if (skillFilter.length > 0) {
      candidates = candidates.filter(p => {
        const candidateSkills = memoryStore.skills.filter(s => s.user_id === p.id);
        return candidateSkills.some(s => skillFilter.some(sf => s.skill_name.toLowerCase().includes(sf)));
      });
    }

    // Score and format each candidate
    const scoredProfiles = candidates.map(candidate => {
      const candidateSkills = memoryStore.skills.filter(s => s.user_id === candidate.id);
      const primarySkills = candidateSkills
        .filter(s => s.is_primary)
        .slice(0, 3)
        .map(s => ({ skill_name: s.skill_name, proficiency: s.proficiency }));

      // If no primary flagged, take top 3
      const displaySkills = primarySkills.length > 0
        ? primarySkills
        : candidateSkills.slice(0, 3).map(s => ({ skill_name: s.skill_name, proficiency: s.proficiency }));

      let connectionStatus = 'none';
      if (currentUserId) {
        const conn = memoryStore.connections.find(c =>
          (c.requester_id === currentUserId && c.receiver_id === candidate.id) ||
          (c.requester_id === candidate.id && c.receiver_id === currentUserId)
        );
        if (conn) {
          if (conn.status === 'accepted') connectionStatus = 'connected';
          else if (conn.status === 'pending') {
            connectionStatus = conn.requester_id === currentUserId ? 'pending_sent' : 'pending_received';
          }
        }
      }

      const recommendationScore = recommendationService.calculateScore(
        candidate,
        currentUser,
        candidateSkills,
        currentUserSkills,
        connectionStatus
      );

      // Mutual connections simulation
      const mutualCount = Math.floor(Math.random() * 5) + 1;

      return {
        id: candidate.id,
        full_name: candidate.full_name,
        avatar_url: candidate.avatar_url,
        bio: candidate.bio || '',
        college: candidate.college || '',
        year_of_study: candidate.year_of_study || '',
        city: candidate.city || null,
        connection_count: candidate.connection_count || 0,
        looking_for: candidate.looking_for || [],
        primary_skills: displaySkills,
        connection_status: connectionStatus,
        recommendation_score: recommendationScore,
        mutual_connections: mutualCount
      };
    });

    // Sort by recommendation score descending
    scoredProfiles.sort((a, b) => b.recommendation_score - a.recommendation_score);

    const total = scoredProfiles.length;
    const from = (page - 1) * limit;
    const paginatedItems = scoredProfiles.slice(from, from + limit);

    return {
      profiles: paginatedItems,
      pagination: {
        page,
        limit,
        total,
        has_more: from + limit < total
      }
    };
  }

  async completeOnboarding(userId, onboardingData, userEmail = null) {
    const { skills = [], ...profileFields } = onboardingData;

    // Deduplicate skills by skill_name
    const seen = new Set();
    const uniqueSkills = [];
    for (const s of skills) {
      const name = (s.skill_name || s.name || '').trim();
      const lower = name.toLowerCase();
      if (name && !seen.has(lower)) {
        seen.add(lower);
        uniqueSkills.push({
          skill_name: name,
          proficiency: s.proficiency || 'Intermediate',
          is_primary: typeof s.is_primary === 'boolean' ? s.is_primary : uniqueSkills.length < 3,
          display_order: typeof s.display_order === 'number' ? s.display_order : uniqueSkills.length + 1
        });
      }
    }

    const completeness = this.calculateCompleteness(profileFields, uniqueSkills);

    const updatedProfile = {
      id: userId,
      ...profileFields,
      is_onboarded: true,
      profile_completeness: completeness,
      updated_at: new Date().toISOString()
    };
    if (userEmail && !updatedProfile.email) {
      updatedProfile.email = userEmail;
    }

    if (isLiveSupabaseConfigured()) {
      try {
        await supabaseAdmin
          .from('profiles')
          .upsert(updatedProfile);

        if (uniqueSkills.length > 0) {
          await supabaseAdmin.from('user_skills').delete().eq('user_id', userId);
          const skillInserts = uniqueSkills.map((s, idx) => ({
            id: uuidv4(),
            user_id: userId,
            skill_name: s.skill_name,
            proficiency: s.proficiency || 'Beginner',
            is_primary: idx < 3,
            display_order: idx + 1
          }));
          await supabaseAdmin.from('user_skills').insert(skillInserts);
        }
      } catch (err) {
        console.error('Supabase completeOnboarding error:', err);
      }
    }

    // Update memoryStore
    const existingIndex = memoryStore.profiles.findIndex(p => p.id === userId);
    if (existingIndex !== -1) {
      memoryStore.profiles[existingIndex] = {
        ...memoryStore.profiles[existingIndex],
        ...updatedProfile
      };
    } else {
      memoryStore.profiles.push({
        email: userEmail || `${userId}@university.edu`,
        connection_count: 0,
        post_count: 0,
        created_at: new Date().toISOString(),
        ...updatedProfile
      });
    }

    // Refresh skills in memoryStore
    memoryStore.skills = memoryStore.skills.filter(s => s.user_id !== userId);
    uniqueSkills.forEach((s, idx) => {
      memoryStore.skills.push({
        id: uuidv4(),
        user_id: userId,
        skill_name: s.skill_name,
        proficiency: s.proficiency || 'Beginner',
        is_primary: idx < 3,
        display_order: idx + 1
      });
    });

    return this.getProfileById(userId, userId);
  }

  async updateProfile(userId, updateData) {
    if (isLiveSupabaseConfigured()) {
      try {
        await supabaseAdmin
          .from('profiles')
          .update({
            ...updateData,
            updated_at: new Date().toISOString()
          })
          .eq('id', userId);
      } catch (err) {
        console.error('Supabase updateProfile error:', err);
      }
    }

    const index = memoryStore.profiles.findIndex(p => p.id === userId);
    if (index !== -1) {
      memoryStore.profiles[index] = {
        ...memoryStore.profiles[index],
        ...updateData,
        updated_at: new Date().toISOString()
      };
      // Recalculate completeness
      const userSkills = memoryStore.skills.filter(s => s.user_id === userId);
      memoryStore.profiles[index].profile_completeness = this.calculateCompleteness(memoryStore.profiles[index], userSkills);
    }

    return this.getProfileById(userId, userId);
  }

  async updateSkills(userId, skills) {
    if (isLiveSupabaseConfigured()) {
      try {
        await supabaseAdmin.from('user_skills').delete().eq('user_id', userId);
        const skillInserts = skills.map((s, idx) => ({
          id: uuidv4(),
          user_id: userId,
          skill_name: s.skill_name,
          proficiency: s.proficiency || 'Beginner',
          is_primary: !!s.is_primary || idx < 3,
          display_order: idx + 1
        }));
        await supabaseAdmin.from('user_skills').insert(skillInserts);
      } catch (err) {
        console.error('Supabase updateSkills error:', err);
      }
    }

    memoryStore.skills = memoryStore.skills.filter(s => s.user_id !== userId);
    skills.forEach((s, idx) => {
      memoryStore.skills.push({
        id: uuidv4(),
        user_id: userId,
        skill_name: s.skill_name,
        proficiency: s.proficiency || 'Beginner',
        is_primary: !!s.is_primary || idx < 3,
        display_order: idx + 1
      });
    });

    return memoryStore.skills.filter(s => s.user_id === userId);
  }
}

module.exports = new ProfileService();
