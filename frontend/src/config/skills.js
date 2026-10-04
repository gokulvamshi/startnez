export const SKILL_DOMAINS = {
  Development: ['Frontend', 'Backend', 'Full-Stack', 'Mobile (React Native, Flutter)', 'Desktop'],
  Design: ['UI/UX Design', 'Graphic Design', 'Product Design', 'Prototyping (Figma, Adobe XD)'],
  'Data & AI': ['Machine Learning', 'Deep Learning', 'Data Science', 'Data Analytics', 'NLP', 'Computer Vision'],
  Infrastructure: ['DevOps', 'Cloud (AWS/GCP/Azure)', 'System Design', 'Database Management', 'Networking'],
  Blockchain: ['Smart Contracts', 'Solidity', 'Web3', 'DeFi', 'NFTs'],
  Cybersecurity: ['Penetration Testing', 'Network Security', 'Cryptography', 'Ethical Hacking'],
  'Soft Skills': ['Pitching/Presenting', 'Project Management', 'Technical Writing', 'Content Creation', 'Video Editing'],
  'Emerging Tech': ['AR/VR', 'IoT', 'Robotics', 'Quantum Computing', 'Game Development']
};

export const ALL_PREDEFINED_SKILLS = Object.values(SKILL_DOMAINS).flat();

export const USER_YEARS = [
  '1st Year',
  '2nd Year',
  '3rd Year',
  '4th Year',
  'Recent Graduate'
];

export const SKILL_PROFICIENCIES = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

export const LOOKING_FOR_OPTIONS = [
  'Hackathon Teammates',
  'Study Partners',
  'Startup Co-founders',
  'Project Collaborators',
  'Mentorship',
  'Networking'
];

export const STARTUP_STAGES = [
  { value: 'idea', label: '💡 Idea Stage' },
  { value: 'building_mvp', label: '🔨 Building MVP' },
  { value: 'mvp_ready', label: '🚀 MVP Ready' },
  { value: 'growing', label: '📈 Growing' },
  { value: 'launched', label: '✅ Launched' }
];

export const POST_CATEGORIES = [
  { value: 'hackathon_experience', label: 'Hackathon Experience' },
  { value: 'project_showcase', label: 'Project Showcase' },
  { value: 'tutorial', label: 'Tutorial / Learning' },
  { value: 'question', label: 'Question / Discussion' },
  { value: 'achievement', label: 'Achievement / Win' },
  { value: 'resource', label: 'Resource Sharing' }
];

export const PROJECT_TYPES = [
  { value: 'hackathon', label: 'Hackathon Project' },
  { value: 'course', label: 'Course Project' },
  { value: 'personal', label: 'Personal Project' },
  { value: 'open_source', label: 'Open Source Contribution' },
  { value: 'startup', label: 'Startup Development' }
];

export const PROJECT_ROLES = [
  { value: 'lead', label: 'Project Lead' },
  { value: 'frontend', label: 'Frontend Engineer' },
  { value: 'backend', label: 'Backend Engineer' },
  { value: 'fullstack', label: 'Full-Stack Engineer' },
  { value: 'designer', label: 'UI/UX Designer' },
  { value: 'presenter', label: 'Pitch / Presenter' },
  { value: 'ml_engineer', label: 'ML / AI Engineer' },
  { value: 'devops', label: 'DevOps / Cloud' },
  { value: 'member', label: 'Team Member' }
];

// Aliases & Additional Enums for components
export const PREDEFINED_SKILLS = SKILL_DOMAINS;
export const SKILL_CATEGORIES = Object.keys(SKILL_DOMAINS);
export const YEAR_OPTIONS = USER_YEARS;
export const PROFICIENCY_LEVELS = SKILL_PROFICIENCIES;

export const UNIVERSITIES = [
  'Stanford University',
  'UC Berkeley',
  'Massachusetts Institute of Technology (MIT)',
  'Carnegie Mellon University',
  'Georgia Institute of Technology',
  'UT Austin',
  'University of Washington',
  'UIUC',
  'University of Michigan',
  'Cornell University',
  'Columbia University',
  'Harvard University',
  'Princeton University',
  'Waterloo University',
  'Purdue University',
  'UCLA',
  'UCSD',
  'NYU'
];

export const INTEREST_OPTIONS = [
  'AI / LLMs',
  'Web3 & Crypto',
  'Climate Tech',
  'FinTech',
  'HealthTech',
  'EdTech',
  'Dev Tools',
  'Open Source',
  'Robotics',
  'Cybersecurity',
  'Gaming'
];

export const KANBAN_STATUSES = [
  { value: 'todo', label: 'To Do' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'review', label: 'In Review' },
  { value: 'done', label: 'Done' }
];

export const KANBAN_PRIORITIES = [
  { value: 0, label: 'None' },
  { value: 1, label: 'Low' },
  { value: 2, label: 'Medium' },
  { value: 3, label: 'High' }
];

export const getDomainStyle = (skillName = '') => {
  const s = skillName.toLowerCase();
  if (s.includes('front') || s.includes('react') || s.includes('vue') || s.includes('css')) {
    return { bg: 'bg-sky-50 dark:bg-sky-950/40', text: 'text-sky-700 dark:text-sky-300', border: 'border-sky-200 dark:border-sky-800' };
  }
  if (s.includes('back') || s.includes('node') || s.includes('python') || s.includes('go') || s.includes('rust')) {
    return { bg: 'bg-emerald-50 dark:bg-emerald-950/40', text: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-200 dark:border-emerald-800' };
  }
  if (s.includes('design') || s.includes('ui') || s.includes('ux') || s.includes('figma')) {
    return { bg: 'bg-pink-50 dark:bg-pink-950/40', text: 'text-pink-700 dark:text-pink-300', border: 'border-pink-200 dark:border-pink-800' };
  }
  if (s.includes('pitch') || s.includes('present') || s.includes('product') || s.includes('lead')) {
    return { bg: 'bg-purple-50 dark:bg-purple-950/40', text: 'text-purple-700 dark:text-purple-300', border: 'border-purple-200 dark:border-purple-800' };
  }
  if (s.includes('ai') || s.includes('ml') || s.includes('data') || s.includes('learn')) {
    return { bg: 'bg-orange-50 dark:bg-orange-950/40', text: 'text-orange-700 dark:text-orange-300', border: 'border-orange-200 dark:border-orange-800' };
  }
  return { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-700 dark:text-slate-300', border: 'border-slate-200 dark:border-slate-700' };
};
