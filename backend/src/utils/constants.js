// Predefined skills list and domains
const SKILL_DOMAINS = {
  Development: ['Frontend', 'Backend', 'Full-Stack', 'Mobile (React Native, Flutter)', 'Desktop'],
  Design: ['UI/UX Design', 'Graphic Design', 'Product Design', 'Prototyping (Figma, Adobe XD)'],
  'Data & AI': ['Machine Learning', 'Deep Learning', 'Data Science', 'Data Analytics', 'NLP', 'Computer Vision'],
  Infrastructure: ['DevOps', 'Cloud (AWS/GCP/Azure)', 'System Design', 'Database Management', 'Networking'],
  Blockchain: ['Smart Contracts', 'Solidity', 'Web3', 'DeFi', 'NFTs'],
  Cybersecurity: ['Penetration Testing', 'Network Security', 'Cryptography', 'Ethical Hacking'],
  'Soft Skills': ['Pitching/Presenting', 'Project Management', 'Technical Writing', 'Content Creation', 'Video Editing'],
  'Emerging Tech': ['AR/VR', 'IoT', 'Robotics', 'Quantum Computing', 'Game Development']
};

const ALL_PREDEFINED_SKILLS = Object.values(SKILL_DOMAINS).flat();

const USER_YEARS = [
  '1st Year',
  '2nd Year',
  '3rd Year',
  '4th Year',
  'Recent Graduate'
];

const SKILL_PROFICIENCIES = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

const LOOKING_FOR_OPTIONS = [
  'Hackathon Teammates',
  'Study Partners',
  'Startup Co-founders',
  'Project Collaborators',
  'Mentorship',
  'Networking'
];

const POST_CATEGORIES = [
  'hackathon_experience',
  'project_showcase',
  'tutorial',
  'question',
  'achievement',
  'resource'
];

const STARTUP_STAGES = [
  'idea',
  'building_mvp',
  'mvp_ready',
  'growing',
  'launched'
];

const PROJECT_TYPES = [
  'hackathon',
  'course',
  'personal',
  'open_source',
  'startup'
];

const PROJECT_ROLES = [
  'lead',
  'frontend',
  'backend',
  'fullstack',
  'designer',
  'presenter',
  'ml_engineer',
  'devops',
  'member'
];

// Complementary skill mapping for recommendation algorithm
const COMPLEMENTARY_SKILLS = {
  Frontend: ['Backend', 'UI/UX Design', 'Pitching/Presenting', 'DevOps'],
  Backend: ['Frontend', 'UI/UX Design', 'DevOps', 'System Design'],
  'Full-Stack': ['UI/UX Design', 'Pitching/Presenting', 'DevOps', 'Machine Learning'],
  'UI/UX Design': ['Frontend', 'Backend', 'Full-Stack', 'Pitching/Presenting'],
  'Machine Learning': ['Full-Stack', 'Backend', 'Frontend', 'Data Science'],
  'Data Science': ['Machine Learning', 'Backend', 'Full-Stack'],
  DevOps: ['Backend', 'Frontend', 'System Design', 'Cloud (AWS/GCP/Azure)'],
  'Mobile (React Native, Flutter)': ['Backend', 'UI/UX Design', 'Pitching/Presenting'],
  'Pitching/Presenting': ['Frontend', 'Backend', 'Full-Stack', 'UI/UX Design', 'Machine Learning'],
  'Project Management': ['Frontend', 'Backend', 'UI/UX Design', 'Pitching/Presenting'],
  Cybersecurity: ['Backend', 'DevOps', 'System Design', 'Network Security'],
  Web3: ['Frontend', 'Smart Contracts', 'Solidity', 'UI/UX Design']
};

module.exports = {
  SKILL_DOMAINS,
  ALL_PREDEFINED_SKILLS,
  USER_YEARS,
  SKILL_PROFICIENCIES,
  LOOKING_FOR_OPTIONS,
  POST_CATEGORIES,
  STARTUP_STAGES,
  PROJECT_TYPES,
  PROJECT_ROLES,
  COMPLEMENTARY_SKILLS
};
