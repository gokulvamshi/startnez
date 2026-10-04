const { v4: uuidv4 } = require('uuid');
const { supabaseAdmin, isLiveSupabaseConfigured } = require('../config/supabase');

// In-Memory Seed State for Development and Fallback
const INITIAL_PROFILES = [
  {
    id: 'a1111111-1111-1111-1111-111111111111',
    email: 'maya.lin@stanford.edu',
    full_name: 'Maya Lin',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    cover_image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
    bio: 'Crafting delightful hackathon MVPs with pixel-perfect interactions. Won 1st place @ TreeHacks \'24. Ready to build something wild with hungry backend hackers!',
    college: 'Stanford University',
    year_of_study: '3rd Year',
    city: 'Palo Alto, CA',
    github_url: 'https://github.com/mayacodes',
    portfolio_url: 'https://maya.design',
    twitter_url: 'https://twitter.com/mayacodes',
    linkedin_url: 'https://linkedin.com/in/mayalin',
    website_url: 'https://maya.design',
    looking_for: ['Hackathon Teammates', 'Startup Co-founders'],
    interests: ['UI/UX', 'Frontend', 'Design Systems', 'Fintech'],
    is_onboarded: true,
    profile_completeness: 95,
    connection_count: 18,
    post_count: 5,
    created_at: new Date(Date.now() - 15 * 86400000).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'a2222222-2222-2222-2222-222222222222',
    email: 'dwash@berkeley.edu',
    full_name: 'Devante Washington',
    avatar_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
    cover_image_url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80',
    bio: 'Go, Rust, PostgreSQL, Docker & Redis. I build resilient APIs and distributed pipelines that do not crash under demo load. CalHacks veteran.',
    college: 'UC Berkeley',
    year_of_study: '4th Year',
    city: 'Berkeley, CA',
    github_url: 'https://github.com/dwash-dev',
    portfolio_url: 'https://dwash.tech',
    twitter_url: 'https://twitter.com/dwash_dev',
    linkedin_url: 'https://linkedin.com/in/devante-washington',
    website_url: 'https://dwash.tech',
    looking_for: ['Hackathon Teammates', 'Project Collaborators'],
    interests: ['Distributed Systems', 'Backend', 'High Throughput', 'Web3'],
    is_onboarded: true,
    profile_completeness: 90,
    connection_count: 24,
    post_count: 7,
    created_at: new Date(Date.now() - 20 * 86400000).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'a3333333-3333-3333-3333-333333333333',
    email: 'ananya@gatech.edu',
    full_name: 'Ananya Sharma',
    avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    cover_image_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80',
    bio: 'Zero stage fright. 2x TEDx youth speaker, product manager, and slide deck architect. I handle the story, customer validation, and live demo pitch.',
    college: 'Georgia Tech',
    year_of_study: '2nd Year',
    city: 'Atlanta, GA',
    github_url: 'https://github.com/ananyasharma',
    portfolio_url: 'https://ananyaspeaks.com',
    twitter_url: 'https://twitter.com/ananya_speaks',
    linkedin_url: 'https://linkedin.com/in/ananyasharma',
    website_url: 'https://ananyaspeaks.com',
    looking_for: ['Startup Co-founders', 'Hackathon Teammates', 'Mentorship'],
    interests: ['Pitching', 'Product Management', 'EdTech', 'AI ethics'],
    is_onboarded: true,
    profile_completeness: 88,
    connection_count: 31,
    post_count: 4,
    created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'a4444444-4444-4444-4444-444444444444',
    email: 'liam.vance@mit.edu',
    full_name: 'Liam Vance',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    cover_image_url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&auto=format&fit=crop&q=80',
    bio: 'Full-stack builder passionate about low-latency web apps and WebAssembly. HackMIT organizer. Always shipping before the clock runs out.',
    college: 'MIT',
    year_of_study: '3rd Year',
    city: 'Cambridge, MA',
    github_url: 'https://github.com/liamvance',
    portfolio_url: 'https://liam.codes',
    twitter_url: 'https://twitter.com/liamv',
    linkedin_url: 'https://linkedin.com/in/liam-vance',
    website_url: 'https://liam.codes',
    looking_for: ['Hackathon Teammates', 'Study Partners'],
    interests: ['Full-Stack', 'Compilers', 'Open Source'],
    is_onboarded: true,
    profile_completeness: 92,
    connection_count: 40,
    post_count: 6,
    created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'a5555555-5555-5555-5555-555555555555',
    email: 'sofia.rodriguez@cmu.edu',
    full_name: 'Sofia Rodriguez',
    avatar_url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&auto=format&fit=crop&q=80',
    cover_image_url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&auto=format&fit=crop&q=80',
    bio: 'Fine-tuning LLMs, vision transformers, and multimodal agents. Researching at CMU LTI. Looking for fullstack wizards to build AI apps that matter.',
    college: 'Carnegie Mellon (CMU)',
    year_of_study: '4th Year',
    city: 'Pittsburgh, PA',
    github_url: 'https://github.com/sofiarodriguez',
    portfolio_url: 'https://sofia.ai',
    twitter_url: 'https://twitter.com/sofia_ai',
    linkedin_url: 'https://linkedin.com/in/sofia-rodriguez-ai',
    website_url: 'https://sofia.ai',
    looking_for: ['Startup Co-founders', 'Hackathon Teammates'],
    interests: ['Machine Learning', 'Computer Vision', 'GenAI', 'Healthcare'],
    is_onboarded: true,
    profile_completeness: 94,
    connection_count: 27,
    post_count: 8,
    created_at: new Date(Date.now() - 40 * 86400000).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'a6666666-6666-6666-6666-666666666666',
    email: 'kai.tanaka@utexas.edu',
    full_name: 'Kai Tanaka',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    cover_image_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80',
    bio: 'Mobile engineer building silky smooth cross-platform applications in Flutter & Swift. Obsessed with 120fps animations and offline-first state.',
    college: 'UT Austin',
    year_of_study: '2nd Year',
    city: 'Austin, TX',
    github_url: 'https://github.com/kaizen-dev',
    portfolio_url: 'https://kai.dev',
    twitter_url: 'https://twitter.com/kaizen_dev',
    linkedin_url: 'https://linkedin.com/in/kaitanaka',
    website_url: 'https://kai.dev',
    looking_for: ['Hackathon Teammates', 'Project Collaborators'],
    interests: ['Mobile Dev', 'Flutter', 'Swift', 'UI Animations'],
    is_onboarded: true,
    profile_completeness: 85,
    connection_count: 14,
    post_count: 3,
    created_at: new Date(Date.now() - 12 * 86400000).toISOString(),
    updated_at: new Date().toISOString()
  }
];

const INITIAL_SKILLS = [
  { id: uuidv4(), user_id: 'a1111111-1111-1111-1111-111111111111', skill_name: 'UI/UX Design', proficiency: 'Expert', is_primary: true, display_order: 1 },
  { id: uuidv4(), user_id: 'a1111111-1111-1111-1111-111111111111', skill_name: 'Frontend', proficiency: 'Advanced', is_primary: true, display_order: 2 },
  { id: uuidv4(), user_id: 'a1111111-1111-1111-1111-111111111111', skill_name: 'Prototyping (Figma, Adobe XD)', proficiency: 'Expert', is_primary: true, display_order: 3 },
  { id: uuidv4(), user_id: 'a1111111-1111-1111-1111-111111111111', skill_name: 'Product Design', proficiency: 'Advanced', is_primary: false, display_order: 4 },

  { id: uuidv4(), user_id: 'a2222222-2222-2222-2222-222222222222', skill_name: 'Backend', proficiency: 'Expert', is_primary: true, display_order: 1 },
  { id: uuidv4(), user_id: 'a2222222-2222-2222-2222-222222222222', skill_name: 'System Design', proficiency: 'Advanced', is_primary: true, display_order: 2 },
  { id: uuidv4(), user_id: 'a2222222-2222-2222-2222-222222222222', skill_name: 'Database Management', proficiency: 'Expert', is_primary: true, display_order: 3 },
  { id: uuidv4(), user_id: 'a2222222-2222-2222-2222-222222222222', skill_name: 'DevOps', proficiency: 'Intermediate', is_primary: false, display_order: 4 },

  { id: uuidv4(), user_id: 'a3333333-3333-3333-3333-333333333333', skill_name: 'Pitching/Presenting', proficiency: 'Expert', is_primary: true, display_order: 1 },
  { id: uuidv4(), user_id: 'a3333333-3333-3333-3333-333333333333', skill_name: 'Project Management', proficiency: 'Advanced', is_primary: true, display_order: 2 },
  { id: uuidv4(), user_id: 'a3333333-3333-3333-3333-333333333333', skill_name: 'Content Creation', proficiency: 'Advanced', is_primary: true, display_order: 3 },

  { id: uuidv4(), user_id: 'a4444444-4444-4444-4444-444444444444', skill_name: 'Full-Stack', proficiency: 'Expert', is_primary: true, display_order: 1 },
  { id: uuidv4(), user_id: 'a4444444-4444-4444-4444-444444444444', skill_name: 'Frontend', proficiency: 'Advanced', is_primary: true, display_order: 2 },
  { id: uuidv4(), user_id: 'a4444444-4444-4444-4444-444444444444', skill_name: 'Backend', proficiency: 'Advanced', is_primary: true, display_order: 3 },

  { id: uuidv4(), user_id: 'a5555555-5555-5555-5555-555555555555', skill_name: 'Machine Learning', proficiency: 'Expert', is_primary: true, display_order: 1 },
  { id: uuidv4(), user_id: 'a5555555-5555-5555-5555-555555555555', skill_name: 'Deep Learning', proficiency: 'Expert', is_primary: true, display_order: 2 },
  { id: uuidv4(), user_id: 'a5555555-5555-5555-5555-555555555555', skill_name: 'Data Science', proficiency: 'Advanced', is_primary: true, display_order: 3 },

  { id: uuidv4(), user_id: 'a6666666-6666-6666-6666-666666666666', skill_name: 'Mobile (React Native, Flutter)', proficiency: 'Expert', is_primary: true, display_order: 1 },
  { id: uuidv4(), user_id: 'a6666666-6666-6666-6666-666666666666', skill_name: 'Frontend', proficiency: 'Intermediate', is_primary: true, display_order: 2 },
  { id: uuidv4(), user_id: 'a6666666-6666-6666-6666-666666666666', skill_name: 'UI/UX Design', proficiency: 'Intermediate', is_primary: true, display_order: 3 }
];

const INITIAL_CONNECTIONS = [
  { id: uuidv4(), requester_id: 'a1111111-1111-1111-1111-111111111111', receiver_id: 'a2222222-2222-2222-2222-222222222222', status: 'accepted', created_at: new Date(Date.now() - 5 * 86400000).toISOString() },
  { id: uuidv4(), requester_id: 'a3333333-3333-3333-3333-333333333333', receiver_id: 'a1111111-1111-1111-1111-111111111111', status: 'pending', created_at: new Date(Date.now() - 1 * 86400000).toISOString() },
  { id: uuidv4(), requester_id: 'a1111111-1111-1111-1111-111111111111', receiver_id: 'a4444444-4444-4444-4444-444444444444', status: 'accepted', created_at: new Date(Date.now() - 3 * 86400000).toISOString() }
];

const INITIAL_POSTS = [
  {
    id: 'b1111111-1111-1111-1111-111111111111',
    author_id: 'a1111111-1111-1111-1111-111111111111',
    post_type: 'hackathon_experience',
    title: 'How our 3-person team won TreeHacks \'24 in 36 hours',
    content: 'Here is the breakdown of how we scoped, designed, and presented SynapseAI at TreeHacks:\n\n1. Lock down the user flow in Figma within the first 4 hours.\n2. Do NOT build a custom auth system—use Supabase immediately.\n3. Rehearse the 3-minute pitch 10 times before judges arrive. Judges judge narrative as much as code!',
    images: ['https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&auto=format&fit=crop&q=80'],
    tags: ['TreeHacks', 'UI/UX Design', 'Hackathon'],
    visibility: 'public',
    like_count: 42,
    comment_count: 6,
    bookmark_count: 12,
    is_edited: false,
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 86400000).toISOString()
  },
  {
    id: 'b2222222-2222-2222-2222-222222222222',
    author_id: 'a2222222-2222-2222-2222-222222222222',
    post_type: 'tutorial',
    title: 'Zero-Crash Hackathon Architecture: Redis + PostgreSQL + WebSockets',
    content: 'Tired of demo-day servers falling over when 5 judges try your site at once? Here is a bulletproof Node.js template using Redis pub/sub and rate limiting that survived 10,000 requests per minute with zero dropped sockets. Repo link in comments!',
    images: ['https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80'],
    tags: ['Backend', 'System Design', 'Go', 'Redis'],
    visibility: 'public',
    like_count: 58,
    comment_count: 9,
    bookmark_count: 21,
    is_edited: false,
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 86400000).toISOString()
  },
  {
    id: 'b3333333-3333-3333-3333-333333333333',
    author_id: 'a3333333-3333-3333-3333-333333333333',
    post_type: 'achievement',
    title: 'The 3-Minute Demo Formula That Won 4 Hackathons in a Row',
    content: 'Most engineers make the mistake of showing terminal logs or registration screens during hackathon pitches. Never do that! Start with the problem in 20 seconds, show the "magic moment" in 60 seconds, highlight the tech moat in 40 seconds, and close with future vision.',
    images: ['https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&auto=format&fit=crop&q=80'],
    tags: ['Pitching', 'Hackathon', 'Storytelling'],
    visibility: 'public',
    like_count: 74,
    comment_count: 15,
    bookmark_count: 33,
    is_edited: false,
    created_at: new Date(Date.now() - 4 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 4 * 86400000).toISOString()
  }
];

const INITIAL_COMMENTS = [
  {
    id: uuidv4(),
    post_id: 'b1111111-1111-1111-1111-111111111111',
    author_id: 'a2222222-2222-2222-2222-222222222222',
    parent_comment_id: null,
    content: '100% agree on skipping custom auth. We spent 4 hours fixing CORS and cookies on our first hackathon and lost so much build time!',
    like_count: 5,
    is_edited: false,
    created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    updated_at: new Date().toISOString()
  }
];

const INITIAL_POST_LIKES = [
  { id: uuidv4(), post_id: 'b1111111-1111-1111-1111-111111111111', user_id: 'a2222222-2222-2222-2222-222222222222' }
];

const INITIAL_POST_BOOKMARKS = [];

const INITIAL_STARTUPS = [
  {
    id: 'c1111111-1111-1111-1111-111111111111',
    founder_id: 'a1111111-1111-1111-1111-111111111111',
    name: 'CollabStudio',
    one_liner: 'Figma for hardware engineers and collegiate robotics teams',
    problem_statement: 'Hardware teams struggle with fragmented CAD files, spreadsheet BOMs, and lack of real-time collaborative review during rapid prototyping sprints.',
    solution: 'A browser-native WebGL platform enabling multi-user 3D assembly inspection, version-controlled BOMs, and instant supplier pricing integration.',
    description: 'We started building this after winning CalHacks and have 12 collegiate robotics teams in our pilot program. Seeking a dedicated backend distributed systems co-founder and a hardware CAD enthusiast.',
    tech_stack: ['Next.js', 'Three.js', 'Go', 'PostgreSQL', 'Docker'],
    roles_needed: ['Backend', 'DevOps', 'System Design'],
    stage: 'building_mvp',
    logo_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
    website_url: 'https://collabstudio.dev',
    application_count: 5,
    member_count: 2,
    is_active: true,
    created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'c2222222-2222-2222-2222-222222222222',
    founder_id: 'a5555555-5555-5555-5555-555555555555',
    name: 'MedCognition',
    one_liner: 'Real-time diagnostic assistance for student clinic triaging',
    problem_statement: 'Student-run health clinics in underserved areas face hours-long wait times and overburdened volunteer clinicians.',
    solution: 'Privacy-first, HIPAA-compliant on-device triage assistant that summarizes vitals and flags urgent differential diagnoses.',
    description: 'Currently piloting with CMU Health Services. Winner of CMU Venture Challenge 2024. Backed by university innovation grant.',
    tech_stack: ['Python', 'PyTorch', 'FastAPI', 'React Native', 'PostgreSQL'],
    roles_needed: ['Full-Stack', 'Mobile (React Native, Flutter)', 'Pitching/Presenting'],
    stage: 'mvp_ready',
    logo_url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=200&auto=format&fit=crop&q=80',
    website_url: 'https://medcognition.health',
    application_count: 8,
    member_count: 3,
    is_active: true,
    created_at: new Date(Date.now() - 14 * 86400000).toISOString(),
    updated_at: new Date().toISOString()
  }
];

const INITIAL_STARTUP_MEMBERS = [
  { id: uuidv4(), startup_id: 'c1111111-1111-1111-1111-111111111111', user_id: 'a1111111-1111-1111-1111-111111111111', role: 'Founder & Designer', is_founder: true, joined_at: new Date().toISOString() },
  { id: uuidv4(), startup_id: 'c1111111-1111-1111-1111-111111111111', user_id: 'a2222222-2222-2222-2222-222222222222', role: 'Backend Lead', is_founder: false, joined_at: new Date().toISOString() }
];

const INITIAL_STARTUP_APPLICATIONS = [
  {
    id: uuidv4(),
    startup_id: 'c1111111-1111-1111-1111-111111111111',
    applicant_id: 'a3333333-3333-3333-3333-333333333333',
    message: 'Hey Maya! Loved your pitch at CalHacks. I can help streamline investor decks and handle user interviews for robotics teams.',
    role_applied_for: 'Pitching/Presenting',
    status: 'pending',
    reviewed_at: null,
    created_at: new Date().toISOString()
  }
];

const INITIAL_PROJECTS = [
  {
    id: 'd1111111-1111-1111-1111-111111111111',
    creator_id: 'a1111111-1111-1111-1111-111111111111',
    name: 'CalHacks 11.0: PulseWave',
    description: 'High-frequency telemetry and health anomaly prediction during extreme student hackathon sprints.',
    hackathon_name: 'CalHacks 11.0',
    project_type: 'hackathon',
    deadline: new Date(Date.now() + 14 * 86400000).toISOString(),
    is_active: true,
    member_count: 3,
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    updated_at: new Date().toISOString()
  }
];

const INITIAL_PROJECT_MEMBERS = [
  { id: uuidv4(), project_id: 'd1111111-1111-1111-1111-111111111111', user_id: 'a1111111-1111-1111-1111-111111111111', role: 'lead', joined_at: new Date().toISOString() },
  { id: uuidv4(), project_id: 'd1111111-1111-1111-1111-111111111111', user_id: 'a2222222-2222-2222-2222-222222222222', role: 'backend', joined_at: new Date().toISOString() },
  { id: uuidv4(), project_id: 'd1111111-1111-1111-1111-111111111111', user_id: 'a3333333-3333-3333-3333-333333333333', role: 'presenter', joined_at: new Date().toISOString() }
];

const INITIAL_KANBAN = [
  { id: 'e1111111-1111-1111-1111-111111111111', project_id: 'd1111111-1111-1111-1111-111111111111', created_by: 'a1111111-1111-1111-1111-111111111111', assigned_to: 'a1111111-1111-1111-1111-111111111111', title: 'Finalize Figma design tokens & dark mode', description: 'Complete color system, typography scale, and card states according to Stitch specs.', status: 'done', priority: 2, display_order: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'e2222222-2222-2222-2222-222222222222', project_id: 'd1111111-1111-1111-1111-111111111111', created_by: 'a1111111-1111-1111-1111-111111111111', assigned_to: 'a2222222-2222-2222-2222-222222222222', title: 'Implement WebSocket real-time telemetry stream', description: 'Set up socket listener for live sensor heartbeat data with backpressure control.', status: 'in_progress', priority: 3, display_order: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'e3333333-3333-3333-3333-333333333333', project_id: 'd1111111-1111-1111-1111-111111111111', created_by: 'a1111111-1111-1111-1111-111111111111', assigned_to: 'a3333333-3333-3333-3333-333333333333', title: 'Structure 3-minute pitch deck narrative', description: 'Create hook, problem slides, architecture diagram, and demo flow for judges.', status: 'todo', priority: 3, display_order: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'e4444444-4444-4444-4444-444444444444', project_id: 'd1111111-1111-1111-1111-111111111111', created_by: 'a1111111-1111-1111-1111-111111111111', assigned_to: 'a2222222-2222-2222-2222-222222222222', title: 'PostgreSQL database indexing for discovery feed', description: 'Ensure pg_trgm indices on full_name and college for sub-10ms queries.', status: 'review', priority: 1, display_order: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
];

const INITIAL_PROJECT_FILES = [
  { id: uuidv4(), project_id: 'd1111111-1111-1111-1111-111111111111', uploaded_by: 'a1111111-1111-1111-1111-111111111111', file_name: 'pulsewave-architecture.png', file_url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80', file_size: 245000, file_type: 'image/png', created_at: new Date().toISOString() }
];

const INITIAL_MESSAGES = [
  { id: uuidv4(), project_id: 'd1111111-1111-1111-1111-111111111111', sender_id: 'a1111111-1111-1111-1111-111111111111', content: 'Hey team! Welcome to the CalHacks workspace. Figma mockups are uploaded to the files tab.', message_type: 'text', file_url: null, is_edited: false, created_at: new Date(Date.now() - 3600000).toISOString() },
  { id: uuidv4(), project_id: 'd1111111-1111-1111-1111-111111111111', sender_id: 'a2222222-2222-2222-2222-222222222222', content: 'Checked out the mockups, looks crisp. Setting up the PostgreSQL schema and Redis pub/sub now.', message_type: 'text', file_url: null, is_edited: false, created_at: new Date(Date.now() - 1800000).toISOString() }
];

const INITIAL_LINKS = [
  { id: uuidv4(), project_id: 'd1111111-1111-1111-1111-111111111111', added_by: 'a1111111-1111-1111-1111-111111111111', title: 'Figma Workspace Specs', url: 'https://figma.com/@hackconnect/pulsewave', description: 'Official UI Kit and interaction flows', created_at: new Date().toISOString() }
];

const INITIAL_NOTES = [
  { id: uuidv4(), project_id: 'd1111111-1111-1111-1111-111111111111', title: 'Judging Criteria & Pitch Checklist', content: '### CalHacks 11.0 Judging Priorities\n- Technical Depth: 35%\n- Design & Polish: 25%\n- Impact: 25%\n- Pitch & Q&A: 15%', last_edited_by: 'a3333333-3333-3333-3333-333333333333', created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
];

const INITIAL_NOTIFICATIONS = [
  {
    id: uuidv4(),
    recipient_id: 'a1111111-1111-1111-1111-111111111111',
    sender_id: 'a3333333-3333-3333-3333-333333333333',
    type: 'connection_request',
    title: 'New Connection Request',
    message: 'Ananya Sharma sent you a connection request.',
    reference_id: 'a3333333-3333-3333-3333-333333333333',
    reference_type: 'connection',
    is_read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString()
  },
  {
    id: uuidv4(),
    recipient_id: 'a1111111-1111-1111-1111-111111111111',
    sender_id: 'a2222222-2222-2222-2222-222222222222',
    type: 'post_like',
    title: 'Liked your post',
    message: 'Devante Washington liked your post "How our 3-person team won TreeHacks \'24".',
    reference_id: 'b1111111-1111-1111-1111-111111111111',
    reference_type: 'post',
    is_read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
  }
];

class MemoryStore {
  constructor() {
    this.profiles = [...INITIAL_PROFILES];
    this.skills = [...INITIAL_SKILLS];
    this.connections = [...INITIAL_CONNECTIONS];
    this.posts = [...INITIAL_POSTS];
    this.comments = [...INITIAL_COMMENTS];
    this.postLikes = [...INITIAL_POST_LIKES];
    this.postBookmarks = [...INITIAL_POST_BOOKMARKS];
    this.startups = [...INITIAL_STARTUPS];
    this.startupMembers = [...INITIAL_STARTUP_MEMBERS];
    this.startupApplications = [...INITIAL_STARTUP_APPLICATIONS];
    this.projects = [...INITIAL_PROJECTS];
    this.projectMembers = [...INITIAL_PROJECT_MEMBERS];
    this.kanbanCards = [...INITIAL_KANBAN];
    this.projectFiles = [...INITIAL_PROJECT_FILES];
    this.projectMessages = [...INITIAL_MESSAGES];
    this.projectLinks = [...INITIAL_LINKS];
    this.projectNotes = [...INITIAL_NOTES];
    this.notifications = [...INITIAL_NOTIFICATIONS];
  }
}

const memoryStore = new MemoryStore();

module.exports = {
  memoryStore,
  isLiveSupabaseConfigured
};
