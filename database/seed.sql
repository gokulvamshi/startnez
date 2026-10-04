-- ============================================================
-- HackConnect Seed Data — Production Grade
-- Populates rich profiles, skills, posts, startups, projects, kanban cards
-- ============================================================

-- Note: In production Supabase, users are created in auth.users first.
-- This script seeds demo records if profiles exist or can be executed in dev environments.

INSERT INTO profiles (id, email, full_name, avatar_url, cover_image_url, bio, college, year_of_study, city, github_url, portfolio_url, twitter_url, linkedin_url, looking_for, interests, is_onboarded, profile_completeness, connection_count, post_count)
VALUES
  ('a1111111-1111-1111-1111-111111111111', 'maya.lin@stanford.edu', 'Maya Lin', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80', 'Crafting delightful hackathon MVPs with pixel-perfect interactions. Won 1st place @ TreeHacks ''24. Ready to build something wild with hungry backend hackers!', 'Stanford University', '3rd Year', 'Palo Alto, CA', 'https://github.com/mayacodes', 'https://maya.design', 'https://twitter.com/mayacodes', 'https://linkedin.com/in/mayalin', ARRAY['Hackathon Teammates', 'Startup Co-founders'], ARRAY['UI/UX', 'Frontend', 'Design Systems', 'Fintech'], TRUE, 95, 18, 5),
  ('a2222222-2222-2222-2222-222222222222', 'dwash@berkeley.edu', 'Devante Washington', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80', 'Go, Rust, PostgreSQL, Docker & Redis. I build resilient APIs and distributed pipelines that do not crash under demo load. CalHacks veteran.', 'UC Berkeley', '4th Year', 'Berkeley, CA', 'https://github.com/dwash-dev', 'https://dwash.tech', 'https://twitter.com/dwash_dev', 'https://linkedin.com/in/devante-washington', ARRAY['Hackathon Teammates', 'Project Collaborators'], ARRAY['Distributed Systems', 'Backend', 'High Throughput', 'Web3'], TRUE, 90, 24, 7),
  ('a3333333-3333-3333-3333-333333333333', 'ananya@gatech.edu', 'Ananya Sharma', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80', 'Zero stage fright. 2x TEDx youth speaker, product manager, and slide deck architect. I handle the story, customer validation, and live demo pitch.', 'Georgia Tech', '2nd Year', 'Atlanta, GA', 'https://github.com/ananyasharma', 'https://ananyaspeaks.com', 'https://twitter.com/ananya_speaks', 'https://linkedin.com/in/ananyasharma', ARRAY['Startup Co-founders', 'Hackathon Teammates', 'Mentorship'], ARRAY['Pitching', 'Product Management', 'EdTech', 'AI ethics'], TRUE, 88, 31, 4),
  ('a4444444-4444-4444-4444-444444444444', 'liam.vance@mit.edu', 'Liam Vance', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&auto=format&fit=crop&q=80', 'Full-stack builder passionate about low-latency web apps and WebAssembly. HackMIT organizer. Always shipping before the clock runs out.', 'MIT', '3rd Year', 'Cambridge, MA', 'https://github.com/liamvance', 'https://liam.codes', 'https://twitter.com/liamv', 'https://linkedin.com/in/liam-vance', ARRAY['Hackathon Teammates', 'Study Partners'], ARRAY['Full-Stack', 'Compilers', 'Open Source'], TRUE, 92, 40, 6),
  ('a5555555-5555-5555-5555-555555555555', 'sofia.rodriguez@cmu.edu', 'Sofia Rodriguez', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&auto=format&fit=crop&q=80', 'Fine-tuning LLMs, vision transformers, and multimodal agents. Researching at CMU LTI. Looking for fullstack wizards to build AI apps that matter.', 'Carnegie Mellon (CMU)', '4th Year', 'Pittsburgh, PA', 'https://github.com/sofiarodriguez', 'https://sofia.ai', 'https://twitter.com/sofia_ai', 'https://linkedin.com/in/sofia-rodriguez-ai', ARRAY['Startup Co-founders', 'Hackathon Teammates'], ARRAY['Machine Learning', 'Computer Vision', 'GenAI', 'Healthcare'], TRUE, 94, 27, 8),
  ('a6666666-6666-6666-6666-666666666666', 'kai.tanaka@utexas.edu', 'Kai Tanaka', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80', 'Mobile engineer building silky smooth cross-platform applications in Flutter & Swift. Obsessed with 120fps animations and offline-first state.', 'UT Austin', '2nd Year', 'Austin, TX', 'https://github.com/kaizen-dev', 'https://kai.dev', 'https://twitter.com/kaizen_dev', 'https://linkedin.com/in/kaitanaka', ARRAY['Hackathon Teammates', 'Project Collaborators'], ARRAY['Mobile Dev', 'Flutter', 'Swift', 'UI Animations'], TRUE, 85, 14, 3),
  ('a7777777-7777-7777-7777-777777777777', 'marcus@berkeley.edu', 'Marcus Sterling', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80', 'Cloud architect and Kubernetes wrangler. Terraform, AWS, automated CI/CD and zero-downtime deployments. Let me handle the infra while you build!', 'UC Berkeley', '3rd Year', 'Berkeley, CA', 'https://github.com/marcus-builds', 'https://marcus.cloud', 'https://twitter.com/marcus_infra', 'https://linkedin.com/in/marcussterling', ARRAY['Hackathon Teammates', 'Startup Co-founders'], ARRAY['DevOps', 'Cloud', 'Kubernetes', 'Security'], TRUE, 87, 20, 2),
  ('a8888888-8888-8888-8888-888888888888', 'elena.rostova@stanford.edu', 'Elena Rostova', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&auto=format&fit=crop&q=80', 'CTF player, cryptography nerd, and application security analyst. I make sure our hackathon submission does not leak user secrets or fail security reviews.', 'Stanford University', '1st Year', 'Stanford, CA', 'https://github.com/elenarostova', 'https://elena.security', 'https://twitter.com/elena_sec', 'https://linkedin.com/in/elena-rostova', ARRAY['Study Partners', 'Hackathon Teammates', 'Mentorship'], ARRAY['Cybersecurity', 'Cryptography', 'Reverse Engineering'], TRUE, 82, 11, 2)
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  college = EXCLUDED.college;

-- SKILLS
INSERT INTO user_skills (user_id, skill_name, proficiency, is_primary, display_order)
VALUES
  ('a1111111-1111-1111-1111-111111111111', 'UI/UX Design', 'Expert', TRUE, 1),
  ('a1111111-1111-1111-1111-111111111111', 'Frontend', 'Advanced', TRUE, 2),
  ('a1111111-1111-1111-1111-111111111111', 'Prototyping (Figma)', 'Expert', TRUE, 3),
  ('a1111111-1111-1111-1111-111111111111', 'Product Design', 'Advanced', FALSE, 4),

  ('a2222222-2222-2222-2222-222222222222', 'Backend', 'Expert', TRUE, 1),
  ('a2222222-2222-2222-2222-222222222222', 'System Design', 'Advanced', TRUE, 2),
  ('a2222222-2222-2222-2222-222222222222', 'Database Management', 'Expert', TRUE, 3),
  ('a2222222-2222-2222-2222-222222222222', 'DevOps', 'Intermediate', FALSE, 4),

  ('a3333333-3333-3333-3333-333333333333', 'Pitching/Presenting', 'Expert', TRUE, 1),
  ('a3333333-3333-3333-3333-333333333333', 'Project Management', 'Advanced', TRUE, 2),
  ('a3333333-3333-3333-3333-333333333333', 'Content Creation', 'Advanced', TRUE, 3),
  ('a3333333-3333-3333-3333-333333333333', 'UI/UX Design', 'Beginner', FALSE, 4),

  ('a4444444-4444-4444-4444-444444444444', 'Full-Stack', 'Expert', TRUE, 1),
  ('a4444444-4444-4444-4444-444444444444', 'Frontend', 'Advanced', TRUE, 2),
  ('a4444444-4444-4444-4444-444444444444', 'Backend', 'Advanced', TRUE, 3),

  ('a5555555-5555-5555-5555-555555555555', 'Machine Learning', 'Expert', TRUE, 1),
  ('a5555555-5555-5555-5555-555555555555', 'Deep Learning', 'Expert', TRUE, 2),
  ('a5555555-5555-5555-5555-555555555555', 'Data Science', 'Advanced', TRUE, 3),

  ('a6666666-6666-6666-6666-666666666666', 'Mobile (React Native, Flutter)', 'Expert', TRUE, 1),
  ('a6666666-6666-6666-6666-666666666666', 'Frontend', 'Intermediate', TRUE, 2),
  ('a6666666-6666-6666-6666-666666666666', 'UI/UX Design', 'Intermediate', TRUE, 3),

  ('a7777777-7777-7777-7777-777777777777', 'DevOps', 'Expert', TRUE, 1),
  ('a7777777-7777-7777-7777-777777777777', 'Cloud (AWS/GCP/Azure)', 'Expert', TRUE, 2),
  ('a7777777-7777-7777-7777-777777777777', 'System Design', 'Advanced', TRUE, 3),

  ('a8888888-8888-8888-8888-888888888888', 'Cybersecurity', 'Advanced', TRUE, 1),
  ('a8888888-8888-8888-8888-888888888888', 'Penetration Testing', 'Intermediate', TRUE, 2),
  ('a8888888-8888-8888-8888-888888888888', 'Cryptography', 'Advanced', TRUE, 3)
ON CONFLICT (user_id, skill_name) DO NOTHING;

-- POSTS
INSERT INTO posts (id, author_id, post_type, title, content, tags, visibility, like_count, comment_count, bookmark_count)
VALUES
  ('b1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 'hackathon_experience', 'How our 3-person team won TreeHacks ''24 in 36 hours', 'Here is the uncensored breakdown of how we scoped, designed, and presented SynapseAI at TreeHacks. Key takeaways:\n1. Lock down the user flow in Figma within the first 4 hours.\n2. Do NOT build a custom auth system—use Supabase or Firebase immediately.\n3. Rehearse the 3-minute pitch 10 times before judges arrive. Judges judge narrative as much as code!', ARRAY['TreeHacks', 'UI/UX Design', 'Hackathon'], 'public', 42, 6, 12),
  ('b2222222-2222-2222-2222-222222222222', 'a2222222-2222-2222-2222-222222222222', 'tutorial', 'Zero-Crash Hackathon Architecture: Redis + PostgreSQL + WebSockets', 'Tired of demo-day servers falling over when 5 judges try your site at once? Here is a bulletproof Node.js/Go template using Redis pub/sub and rate limiting that survived 10,000 requests per minute with zero dropped sockets. Repo link in comments!', ARRAY['Backend', 'System Design', 'Go', 'Redis'], 'public', 58, 9, 21),
  ('b3333333-3333-3333-3333-333333333333', 'a3333333-3333-3333-3333-333333333333', 'achievement', 'The 3-Minute Demo Formula That Won 4 Hackathons in a Row', 'Most engineers make the mistake of showing terminal logs or registration screens during hackathon pitches. Never do that! Start with the problem in 20 seconds, show the "magic moment" in 60 seconds, highlight the tech moat in 40 seconds, and close with future vision.', ARRAY['Pitching', 'Hackathon', 'Storytelling'], 'public', 74, 15, 33),
  ('b4444444-4444-4444-4444-444444444444', 'a5555555-5555-5555-5555-555555555555', 'project_showcase', 'OpenScribe: Edge AI Note-Taker for Lecture Halls', 'Just deployed OpenScribe v0.8. Transcribes classroom audio locally in real-time using Whisper-tiny via WebAssembly with zero data sent to external servers. Looking for mobile contributors!', ARRAY['Machine Learning', 'Open Source', 'WebAssembly'], 'public', 65, 8, 19)
ON CONFLICT (id) DO NOTHING;

-- STARTUPS
INSERT INTO startups (id, founder_id, name, one_liner, problem_statement, solution, description, tech_stack, roles_needed, stage, application_count, member_count)
VALUES
  ('c1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 'CollabStudio', 'Figma for hardware engineers and robotics teams', 'Hardware teams struggle with fragmented CAD files, spreadsheet BOMs, and lack of real-time collaborative review during rapid prototyping sprints.', 'A browser-native WebGL platform enabling multi-user 3D assembly inspection, version-controlled BOMs, and instant supplier pricing integration.', 'We started building this after winning CalHacks and have 12 collegiate robotics teams in our pilot program. Seeking a dedicated backend distributed systems co-founder and a hardware CAD enthusiast.', ARRAY['Next.js', 'Three.js', 'Go', 'PostgreSQL', 'Docker'], ARRAY['Backend', 'DevOps', 'System Design'], 'building_mvp', 5, 2),
  ('c2222222-2222-2222-2222-222222222222', 'a5555555-5555-5555-5555-555555555555', 'MedCognition', 'Real-time diagnostic assistance for student clinic triaging', 'Student-run health clinics in underserved areas face hours-long wait times and overburdened volunteer clinicians.', 'Privacy-first, HIPAA-compliant on-device triage assistant that summarizes vitals and flags urgent differential diagnoses.', 'Currently piloting with CMU Health Services. Winner of CMU Venture Challenge 2024. Backed by university grant.', ARRAY['Python', 'PyTorch', 'FastAPI', 'React Native', 'PostgreSQL'], ARRAY['Full-Stack', 'Mobile (React Native, Flutter)', 'Pitching/Presenting'], 'mvp_ready', 8, 3)
ON CONFLICT (id) DO NOTHING;

-- PROJECTS
INSERT INTO projects (id, creator_id, name, description, hackathon_name, project_type, deadline, member_count)
VALUES
  ('d1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 'CalHacks 11.0: PulseWave', 'High-frequency telemetry and health anomaly prediction during extreme student hackathon sprints.', 'CalHacks 11.0', 'hackathon', NOW() + INTERVAL '14 days', 3),
  ('d2222222-2222-2222-2222-222222222222', 'a4444444-4444-4444-4444-444444444444', 'HackCampus Open Source', 'Unified student identity and skill graph protocol for decentralized university clubs.', 'HackMIT', 'open_source', NOW() + INTERVAL '30 days', 4)
ON CONFLICT (id) DO NOTHING;

-- PROJECT MEMBERS
INSERT INTO project_members (project_id, user_id, role)
VALUES
  ('d1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 'lead'),
  ('d1111111-1111-1111-1111-111111111111', 'a2222222-2222-2222-2222-222222222222', 'backend'),
  ('d1111111-1111-1111-1111-111111111111', 'a3333333-3333-3333-3333-333333333333', 'presenter')
ON CONFLICT (project_id, user_id) DO NOTHING;

-- KANBAN CARDS
INSERT INTO kanban_cards (id, project_id, created_by, assigned_to, title, description, status, priority, display_order)
VALUES
  ('e1111111-1111-1111-1111-111111111111', 'd1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 'Finalize Figma design tokens & dark mode', 'Complete color system, typography scale, and card states according to Stitch specs.', 'done', 2, 1),
  ('e2222222-2222-2222-2222-222222222222', 'd1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 'a2222222-2222-2222-2222-222222222222', 'Implement WebSocket real-time telemetry stream', 'Set up socket listener for live sensor heartbeat data with backpressure control.', 'in_progress', 3, 1),
  ('e3333333-3333-3333-3333-333333333333', 'd1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 'a3333333-3333-3333-3333-333333333333', 'Structure 3-minute pitch deck narrative', 'Create hook, problem slides, architecture diagram, and demo flow for judges.', 'todo', 3, 1),
  ('e4444444-4444-4444-4444-444444444444', 'd1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 'a2222222-2222-2222-2222-222222222222', 'PostgreSQL database indexing for discovery feed', 'Ensure pg_trgm indices on full_name and college for sub-10ms queries.', 'review', 1, 1)
ON CONFLICT (id) DO NOTHING;

-- PROJECT MESSAGES
INSERT INTO project_messages (id, project_id, sender_id, content)
VALUES
  ('f1111111-1111-1111-1111-111111111111', 'd1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 'Hey team! Welcome to the CalHacks workspace. Figma mockups are uploaded to the files tab.'),
  ('f2222222-2222-2222-2222-222222222222', 'd1111111-1111-1111-1111-111111111111', 'a2222222-2222-2222-2222-222222222222', 'Checked out the mockups, looks crisp. Setting up the PostgreSQL schema and Redis pub/sub now.'),
  ('f3333333-3333-3333-3333-333333333333', 'd1111111-1111-1111-1111-111111111111', 'a3333333-3333-3333-3333-333333333333', 'I started drafting the problem statement for our submission. The focus is on real-time biometric anomalies.')
ON CONFLICT (id) DO NOTHING;

-- PROJECT LINKS
INSERT INTO project_links (id, project_id, added_by, title, url, description)
VALUES
  ('l1111111-1111-1111-1111-111111111111', 'd1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 'Figma Workspace Specs', 'https://figma.com/@hackconnect/pulsewave', 'Official UI Kit and interaction flows'),
  ('l2222222-2222-2222-2222-222222222222', 'd1111111-1111-1111-1111-111111111111', 'a2222222-2222-2222-2222-222222222222', 'API Documentation & OpenAPI Specs', 'https://api.pulsewave.dev/docs', 'Interactive Swagger endpoints for streaming ingestion')
ON CONFLICT (id) DO NOTHING;

-- PROJECT NOTES
INSERT INTO project_notes (id, project_id, title, content, last_edited_by)
VALUES
  ('n1111111-1111-1111-1111-111111111111', 'd1111111-1111-1111-1111-111111111111', 'Judging Criteria & Pitch Checklist', '### CalHacks 11.0 Judging Priorities\n- **Technical Depth (35%)**: Custom distributed telemetry pipeline.\n- **Design & Polish (25%)**: Pixel-perfect Stitch design system with responsive charts.\n- **Practical Impact (25%)**: Real problem faced by student developers.\n- **Pitch & Q&A (15%)**: Keep answers under 30 seconds with concrete data.', 'a3333333-3333-3333-3333-333333333333')
ON CONFLICT (id) DO NOTHING;
