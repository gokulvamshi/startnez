const { memoryStore } = require('./store');

class SearchService {
  async search(queryText, type = 'all', limit = 20) {
    const q = (queryText || '').trim().toLowerCase();
    if (!q) {
      return { people: [], posts: [], startups: [], projects: [] };
    }

    let people = [];
    let posts = [];
    let startups = [];
    let projects = [];

    // Search People
    if (type === 'all' || type === 'people') {
      people = memoryStore.profiles
        .filter(p => {
          const matchName = p.full_name && p.full_name.toLowerCase().includes(q);
          const matchCollege = p.college && p.college.toLowerCase().includes(q);
          const matchBio = p.bio && p.bio.toLowerCase().includes(q);
          const userSkills = memoryStore.skills.filter(s => s.user_id === p.id);
          const matchSkills = userSkills.some(s => s.skill_name.toLowerCase().includes(q));
          return matchName || matchCollege || matchBio || matchSkills;
        })
        .slice(0, limit)
        .map(p => {
          const skills = memoryStore.skills.filter(s => s.user_id === p.id);
          return {
            id: p.id,
            full_name: p.full_name,
            avatar_url: p.avatar_url,
            college: p.college,
            year_of_study: p.year_of_study,
            bio: p.bio,
            skills: skills.slice(0, 3).map(s => s.skill_name)
          };
        });
    }

    // Search Posts
    if (type === 'all' || type === 'posts') {
      posts = memoryStore.posts
        .filter(p => {
          const matchTitle = p.title && p.title.toLowerCase().includes(q);
          const matchContent = p.content && p.content.toLowerCase().includes(q);
          const matchTags = p.tags && p.tags.some(t => t.toLowerCase().includes(q));
          return matchTitle || matchContent || matchTags;
        })
        .slice(0, limit)
        .map(p => {
          const author = memoryStore.profiles.find(prof => prof.id === p.author_id);
          return {
            id: p.id,
            title: p.title,
            content: p.content.slice(0, 180),
            post_type: p.post_type,
            like_count: p.like_count,
            comment_count: p.comment_count,
            created_at: p.created_at,
            author: author ? { id: author.id, full_name: author.full_name, avatar_url: author.avatar_url } : null
          };
        });
    }

    // Search Startups
    if (type === 'all' || type === 'startups') {
      startups = memoryStore.startups
        .filter(s => {
          const matchName = s.name.toLowerCase().includes(q);
          const matchPitch = s.one_liner.toLowerCase().includes(q);
          const matchProblem = s.problem_statement.toLowerCase().includes(q);
          const matchTech = s.tech_stack && s.tech_stack.some(t => t.toLowerCase().includes(q));
          const matchRoles = s.roles_needed && s.roles_needed.some(r => r.toLowerCase().includes(q));
          return matchName || matchPitch || matchProblem || matchTech || matchRoles;
        })
        .slice(0, limit)
        .map(s => {
          const founder = memoryStore.profiles.find(p => p.id === s.founder_id);
          return {
            id: s.id,
            name: s.name,
            one_liner: s.one_liner,
            stage: s.stage,
            roles_needed: s.roles_needed,
            founder: founder ? { id: founder.id, full_name: founder.full_name, college: founder.college } : null
          };
        });
    }

    // Search Projects
    if (type === 'all' || type === 'projects') {
      projects = memoryStore.projects
        .filter(pr => {
          const matchName = pr.name.toLowerCase().includes(q);
          const matchDesc = pr.description.toLowerCase().includes(q);
          const matchHackathon = pr.hackathon_name && pr.hackathon_name.toLowerCase().includes(q);
          return matchName || matchDesc || matchHackathon;
        })
        .slice(0, limit);
    }

    return {
      query: q,
      people,
      posts,
      startups,
      projects,
      total_matches: people.length + posts.length + startups.length + projects.length
    };
  }
}

module.exports = new SearchService();
