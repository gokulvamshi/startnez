-- ============================================================
-- HackConnect — Supabase Migration 001
-- Combined: Schema + RLS Policies + Storage Buckets + Seed Data
-- Target: Supabase Cloud PostgreSQL (run via service role key)
-- ============================================================

-- ============================================================
-- SECTION 1: EXTENSIONS
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- SECTION 2: ENUM TYPES
-- (Use DO block to skip gracefully if already exists)
-- ============================================================

DO $$ BEGIN
  CREATE TYPE user_year AS ENUM ('1st Year', '2nd Year', '3rd Year', '4th Year', 'Recent Graduate');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE skill_proficiency AS ENUM ('Beginner', 'Intermediate', 'Advanced', 'Expert');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE connection_status AS ENUM ('pending', 'accepted', 'rejected', 'blocked');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE post_type AS ENUM ('hackathon_experience', 'project_showcase', 'tutorial', 'question', 'achievement', 'resource');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE post_visibility AS ENUM ('public', 'connections_only');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE startup_stage AS ENUM ('idea', 'building_mvp', 'mvp_ready', 'growing', 'launched');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE application_status AS ENUM ('pending', 'accepted', 'rejected', 'withdrawn');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE project_type AS ENUM ('hackathon', 'course', 'personal', 'open_source', 'startup');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE project_role AS ENUM ('lead', 'frontend', 'backend', 'fullstack', 'designer', 'presenter', 'ml_engineer', 'devops', 'member');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE notification_type AS ENUM ('connection_request', 'connection_accepted', 'post_like', 'post_comment', 'project_invite', 'project_message', 'startup_application', 'startup_application_accepted', 'startup_application_rejected', 'mention');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE kanban_status AS ENUM ('todo', 'in_progress', 'review', 'done');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ============================================================
-- SECTION 3: TABLES
-- ============================================================

-- PROFILES
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL CHECK (char_length(full_name) BETWEEN 2 AND 50),
  avatar_url TEXT,
  cover_image_url TEXT,
  bio TEXT CHECK (char_length(bio) <= 500),
  college TEXT CHECK (char_length(college) <= 100),
  year_of_study user_year,
  city TEXT CHECK (char_length(city) <= 50),
  github_url TEXT,
  portfolio_url TEXT,
  twitter_url TEXT,
  linkedin_url TEXT,
  website_url TEXT,
  looking_for TEXT[] DEFAULT '{}',
  interests TEXT[] DEFAULT '{}',
  is_onboarded BOOLEAN DEFAULT FALSE,
  profile_completeness INTEGER DEFAULT 0 CHECK (profile_completeness BETWEEN 0 AND 100),
  connection_count INTEGER DEFAULT 0,
  post_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_full_name_trgm ON profiles USING gin(full_name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_profiles_college_trgm ON profiles USING gin(college gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_profiles_year ON profiles(year_of_study);
CREATE INDEX IF NOT EXISTS idx_profiles_onboarded ON profiles(is_onboarded);

-- USER SKILLS
CREATE TABLE IF NOT EXISTS user_skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  skill_name TEXT NOT NULL CHECK (char_length(skill_name) BETWEEN 1 AND 50),
  proficiency skill_proficiency NOT NULL DEFAULT 'Beginner',
  is_primary BOOLEAN DEFAULT FALSE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, skill_name)
);

CREATE INDEX IF NOT EXISTS idx_user_skills_user ON user_skills(user_id);
CREATE INDEX IF NOT EXISTS idx_user_skills_skill ON user_skills(skill_name);
CREATE INDEX IF NOT EXISTS idx_user_skills_primary ON user_skills(user_id, is_primary) WHERE is_primary = TRUE;

-- CONNECTIONS
CREATE TABLE IF NOT EXISTS connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  requester_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status connection_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(requester_id, receiver_id),
  CHECK (requester_id != receiver_id)
);

CREATE INDEX IF NOT EXISTS idx_connections_requester ON connections(requester_id);
CREATE INDEX IF NOT EXISTS idx_connections_receiver ON connections(receiver_id);
CREATE INDEX IF NOT EXISTS idx_connections_status ON connections(status);
CREATE INDEX IF NOT EXISTS idx_connections_pair ON connections(requester_id, receiver_id, status);

-- POSTS
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  post_type post_type NOT NULL DEFAULT 'hackathon_experience',
  title TEXT CHECK (char_length(title) <= 100),
  content TEXT NOT NULL CHECK (char_length(content) BETWEEN 10 AND 5000),
  images TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  visibility post_visibility NOT NULL DEFAULT 'public',
  like_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  bookmark_count INTEGER DEFAULT 0,
  is_edited BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_posts_author ON posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_type ON posts(post_type);
CREATE INDEX IF NOT EXISTS idx_posts_created ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_visibility ON posts(visibility);
CREATE INDEX IF NOT EXISTS idx_posts_tags ON posts USING gin(tags);

-- POST LIKES
CREATE TABLE IF NOT EXISTS post_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_post_likes_post ON post_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_post_likes_user ON post_likes(user_id);

-- POST COMMENTS
CREATE TABLE IF NOT EXISTS post_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  parent_comment_id UUID REFERENCES post_comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL CHECK (char_length(content) BETWEEN 1 AND 1000),
  like_count INTEGER DEFAULT 0,
  is_edited BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_comments_post ON post_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_author ON post_comments(author_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent ON post_comments(parent_comment_id);

-- POST BOOKMARKS
CREATE TABLE IF NOT EXISTS post_bookmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON post_bookmarks(user_id);

-- STARTUPS
CREATE TABLE IF NOT EXISTS startups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  founder_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL CHECK (char_length(name) BETWEEN 2 AND 100),
  one_liner TEXT NOT NULL CHECK (char_length(one_liner) BETWEEN 10 AND 150),
  problem_statement TEXT NOT NULL CHECK (char_length(problem_statement) BETWEEN 20 AND 1000),
  solution TEXT NOT NULL CHECK (char_length(solution) BETWEEN 20 AND 2000),
  description TEXT CHECK (char_length(description) <= 5000),
  tech_stack TEXT[] DEFAULT '{}',
  roles_needed TEXT[] DEFAULT '{}',
  stage startup_stage NOT NULL DEFAULT 'idea',
  logo_url TEXT,
  website_url TEXT,
  application_count INTEGER DEFAULT 0,
  member_count INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_startups_founder ON startups(founder_id);
CREATE INDEX IF NOT EXISTS idx_startups_stage ON startups(stage);
CREATE INDEX IF NOT EXISTS idx_startups_active ON startups(is_active);
CREATE INDEX IF NOT EXISTS idx_startups_roles ON startups USING gin(roles_needed);
CREATE INDEX IF NOT EXISTS idx_startups_tech ON startups USING gin(tech_stack);

-- STARTUP MEMBERS
CREATE TABLE IF NOT EXISTS startup_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  startup_id UUID NOT NULL REFERENCES startups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'Member',
  is_founder BOOLEAN DEFAULT FALSE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(startup_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_startup_members_startup ON startup_members(startup_id);
CREATE INDEX IF NOT EXISTS idx_startup_members_user ON startup_members(user_id);

-- STARTUP APPLICATIONS
CREATE TABLE IF NOT EXISTS startup_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  startup_id UUID NOT NULL REFERENCES startups(id) ON DELETE CASCADE,
  applicant_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  message TEXT CHECK (char_length(message) <= 500),
  role_applied_for TEXT,
  status application_status NOT NULL DEFAULT 'pending',
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(startup_id, applicant_id)
);

CREATE INDEX IF NOT EXISTS idx_startup_apps_startup ON startup_applications(startup_id);
CREATE INDEX IF NOT EXISTS idx_startup_apps_applicant ON startup_applications(applicant_id);
CREATE INDEX IF NOT EXISTS idx_startup_apps_status ON startup_applications(status);

-- PROJECTS
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL CHECK (char_length(name) BETWEEN 2 AND 100),
  description TEXT NOT NULL CHECK (char_length(description) BETWEEN 10 AND 1000),
  hackathon_name TEXT CHECK (char_length(hackathon_name) <= 100),
  project_type project_type NOT NULL DEFAULT 'hackathon',
  deadline TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  member_count INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_projects_creator ON projects(creator_id);
CREATE INDEX IF NOT EXISTS idx_projects_active ON projects(is_active);

-- PROJECT MEMBERS
CREATE TABLE IF NOT EXISTS project_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role project_role NOT NULL DEFAULT 'member',
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(project_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_project_members_project ON project_members(project_id);
CREATE INDEX IF NOT EXISTS idx_project_members_user ON project_members(user_id);

-- KANBAN CARDS (Ideas Board)
CREATE TABLE IF NOT EXISTS kanban_cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
  title TEXT NOT NULL CHECK (char_length(title) BETWEEN 1 AND 200),
  description TEXT CHECK (char_length(description) <= 2000),
  status kanban_status NOT NULL DEFAULT 'todo',
  priority INTEGER DEFAULT 0 CHECK (priority BETWEEN 0 AND 3),
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_kanban_project ON kanban_cards(project_id);
CREATE INDEX IF NOT EXISTS idx_kanban_status ON kanban_cards(project_id, status);
CREATE INDEX IF NOT EXISTS idx_kanban_assigned ON kanban_cards(assigned_to);

-- PROJECT FILES
CREATE TABLE IF NOT EXISTS project_files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  uploaded_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL CHECK (char_length(file_name) BETWEEN 1 AND 255),
  file_url TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  file_type TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_project_files_project ON project_files(project_id);

-- PROJECT MESSAGES (Real-Time Chat)
CREATE TABLE IF NOT EXISTS project_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL CHECK (char_length(content) BETWEEN 1 AND 2000),
  message_type TEXT DEFAULT 'text',
  file_url TEXT,
  is_edited BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_project_messages_project ON project_messages(project_id);
CREATE INDEX IF NOT EXISTS idx_project_messages_created ON project_messages(project_id, created_at DESC);

-- PROJECT LINKS
CREATE TABLE IF NOT EXISTS project_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  added_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL CHECK (char_length(title) BETWEEN 1 AND 200),
  url TEXT NOT NULL,
  description TEXT CHECK (char_length(description) <= 500),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_project_links_project ON project_links(project_id);

-- PROJECT NOTES
CREATE TABLE IF NOT EXISTS project_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'Untitled Note' CHECK (char_length(title) BETWEEN 1 AND 200),
  content TEXT DEFAULT '',
  last_edited_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_project_notes_project ON project_notes(project_id);

-- NOTIFICATIONS
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipient_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  type notification_type NOT NULL,
  title TEXT NOT NULL CHECK (char_length(title) <= 200),
  message TEXT CHECK (char_length(message) <= 500),
  reference_id UUID,
  reference_type TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON notifications(recipient_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(recipient_id, is_read) WHERE is_read = FALSE;
CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(recipient_id, created_at DESC);

-- ============================================================
-- SECTION 4: FUNCTIONS & TRIGGERS
-- ============================================================

-- Generic updated_at updater
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_profiles_updated_at ON profiles;
CREATE TRIGGER set_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS set_posts_updated_at ON posts;
CREATE TRIGGER set_posts_updated_at BEFORE UPDATE ON posts FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS set_comments_updated_at ON post_comments;
CREATE TRIGGER set_comments_updated_at BEFORE UPDATE ON post_comments FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS set_startups_updated_at ON startups;
CREATE TRIGGER set_startups_updated_at BEFORE UPDATE ON startups FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS set_projects_updated_at ON projects;
CREATE TRIGGER set_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS set_kanban_updated_at ON kanban_cards;
CREATE TRIGGER set_kanban_updated_at BEFORE UPDATE ON kanban_cards FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS set_notes_updated_at ON project_notes;
CREATE TRIGGER set_notes_updated_at BEFORE UPDATE ON project_notes FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS set_connections_updated_at ON connections;
CREATE TRIGGER set_connections_updated_at BEFORE UPDATE ON connections FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-create profile row when a new auth.users row is inserted
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', NULL)
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Auto connection_count denormalization
CREATE OR REPLACE FUNCTION update_connection_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND NEW.status = 'accepted' AND OLD.status = 'pending' THEN
    UPDATE profiles SET connection_count = connection_count + 1 WHERE id = NEW.requester_id;
    UPDATE profiles SET connection_count = connection_count + 1 WHERE id = NEW.receiver_id;
  ELSIF TG_OP = 'DELETE' AND OLD.status = 'accepted' THEN
    UPDATE profiles SET connection_count = GREATEST(connection_count - 1, 0) WHERE id = OLD.requester_id;
    UPDATE profiles SET connection_count = GREATEST(connection_count - 1, 0) WHERE id = OLD.receiver_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_connection_change ON connections;
CREATE TRIGGER on_connection_change
  AFTER UPDATE OR DELETE ON connections
  FOR EACH ROW EXECUTE FUNCTION update_connection_counts();

-- Auto post like_count denormalization
CREATE OR REPLACE FUNCTION update_post_like_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE posts SET like_count = like_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE posts SET like_count = GREATEST(like_count - 1, 0) WHERE id = OLD.post_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_post_like_change ON post_likes;
CREATE TRIGGER on_post_like_change
  AFTER INSERT OR DELETE ON post_likes
  FOR EACH ROW EXECUTE FUNCTION update_post_like_count();

-- Auto post comment_count denormalization
CREATE OR REPLACE FUNCTION update_post_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE posts SET comment_count = comment_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE posts SET comment_count = GREATEST(comment_count - 1, 0) WHERE id = OLD.post_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_post_comment_change ON post_comments;
CREATE TRIGGER on_post_comment_change
  AFTER INSERT OR DELETE ON post_comments
  FOR EACH ROW EXECUTE FUNCTION update_post_comment_count();

-- Auto post bookmark_count denormalization
CREATE OR REPLACE FUNCTION update_post_bookmark_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE posts SET bookmark_count = bookmark_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE posts SET bookmark_count = GREATEST(bookmark_count - 1, 0) WHERE id = OLD.post_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_post_bookmark_change ON post_bookmarks;
CREATE TRIGGER on_post_bookmark_change
  AFTER INSERT OR DELETE ON post_bookmarks
  FOR EACH ROW EXECUTE FUNCTION update_post_bookmark_count();

-- Auto profile post_count denormalization
CREATE OR REPLACE FUNCTION update_user_post_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE profiles SET post_count = post_count + 1 WHERE id = NEW.author_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE profiles SET post_count = GREATEST(post_count - 1, 0) WHERE id = OLD.author_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_post_change ON posts;
CREATE TRIGGER on_post_change
  AFTER INSERT OR DELETE ON posts
  FOR EACH ROW EXECUTE FUNCTION update_user_post_count();

-- ============================================================
-- SECTION 5: ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE startups ENABLE ROW LEVEL SECURITY;
ALTER TABLE startup_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE startup_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE kanban_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- PROFILES
DROP POLICY IF EXISTS "Profiles are viewable by authenticated users" ON profiles;
CREATE POLICY "Profiles are viewable by authenticated users" ON profiles
  FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- USER SKILLS
DROP POLICY IF EXISTS "Skills are viewable by authenticated users" ON user_skills;
CREATE POLICY "Skills are viewable by authenticated users" ON user_skills
  FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can manage own skills" ON user_skills;
CREATE POLICY "Users can manage own skills" ON user_skills
  FOR ALL USING (auth.uid() = user_id);

-- CONNECTIONS
DROP POLICY IF EXISTS "Users can view own connections" ON connections;
CREATE POLICY "Users can view own connections" ON connections
  FOR SELECT USING (auth.uid() = requester_id OR auth.uid() = receiver_id);

DROP POLICY IF EXISTS "Users can create connection requests" ON connections;
CREATE POLICY "Users can create connection requests" ON connections
  FOR INSERT WITH CHECK (auth.uid() = requester_id);

DROP POLICY IF EXISTS "Users can update connections they are part of" ON connections;
CREATE POLICY "Users can update connections they are part of" ON connections
  FOR UPDATE USING (auth.uid() = receiver_id OR auth.uid() = requester_id);

DROP POLICY IF EXISTS "Users can delete own connection requests" ON connections;
CREATE POLICY "Users can delete own connection requests" ON connections
  FOR DELETE USING (auth.uid() = requester_id OR auth.uid() = receiver_id);

-- POSTS
DROP POLICY IF EXISTS "Public posts viewable by authenticated users" ON posts;
CREATE POLICY "Public posts viewable by authenticated users" ON posts
  FOR SELECT USING (
    auth.role() = 'authenticated' AND (
      visibility = 'public' OR
      author_id = auth.uid() OR
      EXISTS (
        SELECT 1 FROM connections
        WHERE status = 'accepted'
        AND ((requester_id = auth.uid() AND receiver_id = posts.author_id)
          OR (receiver_id = auth.uid() AND requester_id = posts.author_id))
      )
    )
  );

DROP POLICY IF EXISTS "Users can create posts" ON posts;
CREATE POLICY "Users can create posts" ON posts
  FOR INSERT WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS "Users can update own posts" ON posts;
CREATE POLICY "Users can update own posts" ON posts
  FOR UPDATE USING (auth.uid() = author_id);

DROP POLICY IF EXISTS "Users can delete own posts" ON posts;
CREATE POLICY "Users can delete own posts" ON posts
  FOR DELETE USING (auth.uid() = author_id);

-- POST LIKES
DROP POLICY IF EXISTS "Likes viewable by authenticated users" ON post_likes;
CREATE POLICY "Likes viewable by authenticated users" ON post_likes
  FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can manage own likes" ON post_likes;
CREATE POLICY "Users can manage own likes" ON post_likes
  FOR ALL USING (auth.uid() = user_id);

-- POST COMMENTS
DROP POLICY IF EXISTS "Comments viewable by authenticated users" ON post_comments;
CREATE POLICY "Comments viewable by authenticated users" ON post_comments
  FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can create comments" ON post_comments;
CREATE POLICY "Users can create comments" ON post_comments
  FOR INSERT WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS "Users can update own comments" ON post_comments;
CREATE POLICY "Users can update own comments" ON post_comments
  FOR UPDATE USING (auth.uid() = author_id);

DROP POLICY IF EXISTS "Users can delete own comments" ON post_comments;
CREATE POLICY "Users can delete own comments" ON post_comments
  FOR DELETE USING (auth.uid() = author_id);

-- POST BOOKMARKS
DROP POLICY IF EXISTS "Users can manage own bookmarks" ON post_bookmarks;
CREATE POLICY "Users can manage own bookmarks" ON post_bookmarks
  FOR ALL USING (auth.uid() = user_id);

-- STARTUPS
DROP POLICY IF EXISTS "Active startups viewable by authenticated users" ON startups;
CREATE POLICY "Active startups viewable by authenticated users" ON startups
  FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can create startups" ON startups;
CREATE POLICY "Users can create startups" ON startups
  FOR INSERT WITH CHECK (auth.uid() = founder_id);

DROP POLICY IF EXISTS "Founders can update own startups" ON startups;
CREATE POLICY "Founders can update own startups" ON startups
  FOR UPDATE USING (auth.uid() = founder_id);

DROP POLICY IF EXISTS "Founders can delete own startups" ON startups;
CREATE POLICY "Founders can delete own startups" ON startups
  FOR DELETE USING (auth.uid() = founder_id);

-- STARTUP MEMBERS
DROP POLICY IF EXISTS "Startup members viewable by authenticated users" ON startup_members;
CREATE POLICY "Startup members viewable by authenticated users" ON startup_members
  FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Founders can manage startup members" ON startup_members;
CREATE POLICY "Founders can manage startup members" ON startup_members
  FOR ALL USING (
    EXISTS (SELECT 1 FROM startups WHERE id = startup_members.startup_id AND founder_id = auth.uid())
  );

-- STARTUP APPLICATIONS
DROP POLICY IF EXISTS "Applicants can view own applications" ON startup_applications;
CREATE POLICY "Applicants can view own applications" ON startup_applications
  FOR SELECT USING (
    auth.uid() = applicant_id OR
    EXISTS (SELECT 1 FROM startups WHERE id = startup_applications.startup_id AND founder_id = auth.uid())
  );

DROP POLICY IF EXISTS "Users can create applications" ON startup_applications;
CREATE POLICY "Users can create applications" ON startup_applications
  FOR INSERT WITH CHECK (auth.uid() = applicant_id);

DROP POLICY IF EXISTS "Founders can update applications" ON startup_applications;
CREATE POLICY "Founders can update applications" ON startup_applications
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM startups WHERE id = startup_applications.startup_id AND founder_id = auth.uid())
    OR (auth.uid() = applicant_id)
  );

-- PROJECTS
DROP POLICY IF EXISTS "Project members can view projects" ON projects;
CREATE POLICY "Project members can view projects" ON projects
  FOR SELECT USING (
    auth.uid() = creator_id OR
    EXISTS (SELECT 1 FROM project_members WHERE project_id = projects.id AND user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Users can create projects" ON projects;
CREATE POLICY "Users can create projects" ON projects
  FOR INSERT WITH CHECK (auth.uid() = creator_id);

DROP POLICY IF EXISTS "Creators can update projects" ON projects;
CREATE POLICY "Creators can update projects" ON projects
  FOR UPDATE USING (auth.uid() = creator_id);

DROP POLICY IF EXISTS "Creators can delete projects" ON projects;
CREATE POLICY "Creators can delete projects" ON projects
  FOR DELETE USING (auth.uid() = creator_id);

-- PROJECT MEMBERS
DROP POLICY IF EXISTS "Members can view project members" ON project_members;
CREATE POLICY "Members can view project members" ON project_members
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM project_members pm WHERE pm.project_id = project_members.project_id AND pm.user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM projects WHERE id = project_members.project_id AND creator_id = auth.uid())
  );

DROP POLICY IF EXISTS "Creators can manage project members" ON project_members;
CREATE POLICY "Creators can manage project members" ON project_members
  FOR ALL USING (
    EXISTS (SELECT 1 FROM projects WHERE id = project_members.project_id AND creator_id = auth.uid())
  );

-- KANBAN CARDS
DROP POLICY IF EXISTS "Project members can view kanban cards" ON kanban_cards;
CREATE POLICY "Project members can view kanban cards" ON kanban_cards
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM project_members WHERE project_id = kanban_cards.project_id AND user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM projects WHERE id = kanban_cards.project_id AND creator_id = auth.uid())
  );

DROP POLICY IF EXISTS "Project members can manage kanban cards" ON kanban_cards;
CREATE POLICY "Project members can manage kanban cards" ON kanban_cards
  FOR ALL USING (
    EXISTS (SELECT 1 FROM project_members WHERE project_id = kanban_cards.project_id AND user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM projects WHERE id = kanban_cards.project_id AND creator_id = auth.uid())
  );

-- PROJECT FILES
DROP POLICY IF EXISTS "Project members can view files" ON project_files;
CREATE POLICY "Project members can view files" ON project_files
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM project_members WHERE project_id = project_files.project_id AND user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM projects WHERE id = project_files.project_id AND creator_id = auth.uid())
  );

DROP POLICY IF EXISTS "Project members can upload files" ON project_files;
CREATE POLICY "Project members can upload files" ON project_files
  FOR INSERT WITH CHECK (
    auth.uid() = uploaded_by AND (
      EXISTS (SELECT 1 FROM project_members WHERE project_id = project_files.project_id AND user_id = auth.uid())
      OR EXISTS (SELECT 1 FROM projects WHERE id = project_files.project_id AND creator_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "Uploaders can delete own files" ON project_files;
CREATE POLICY "Uploaders can delete own files" ON project_files
  FOR DELETE USING (auth.uid() = uploaded_by);

-- PROJECT MESSAGES
DROP POLICY IF EXISTS "Project members can view messages" ON project_messages;
CREATE POLICY "Project members can view messages" ON project_messages
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM project_members WHERE project_id = project_messages.project_id AND user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM projects WHERE id = project_messages.project_id AND creator_id = auth.uid())
  );

DROP POLICY IF EXISTS "Project members can send messages" ON project_messages;
CREATE POLICY "Project members can send messages" ON project_messages
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id AND (
      EXISTS (SELECT 1 FROM project_members WHERE project_id = project_messages.project_id AND user_id = auth.uid())
      OR EXISTS (SELECT 1 FROM projects WHERE id = project_messages.project_id AND creator_id = auth.uid())
    )
  );

-- PROJECT LINKS
DROP POLICY IF EXISTS "Project members can view links" ON project_links;
CREATE POLICY "Project members can view links" ON project_links
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM project_members WHERE project_id = project_links.project_id AND user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM projects WHERE id = project_links.project_id AND creator_id = auth.uid())
  );

DROP POLICY IF EXISTS "Project members can manage links" ON project_links;
CREATE POLICY "Project members can manage links" ON project_links
  FOR ALL USING (
    EXISTS (SELECT 1 FROM project_members WHERE project_id = project_links.project_id AND user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM projects WHERE id = project_links.project_id AND creator_id = auth.uid())
  );

-- PROJECT NOTES
DROP POLICY IF EXISTS "Project members can view notes" ON project_notes;
CREATE POLICY "Project members can view notes" ON project_notes
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM project_members WHERE project_id = project_notes.project_id AND user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM projects WHERE id = project_notes.project_id AND creator_id = auth.uid())
  );

DROP POLICY IF EXISTS "Project members can manage notes" ON project_notes;
CREATE POLICY "Project members can manage notes" ON project_notes
  FOR ALL USING (
    EXISTS (SELECT 1 FROM project_members WHERE project_id = project_notes.project_id AND user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM projects WHERE id = project_notes.project_id AND creator_id = auth.uid())
  );

-- NOTIFICATIONS
DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (auth.uid() = recipient_id);

DROP POLICY IF EXISTS "System can create notifications" ON notifications;
CREATE POLICY "System can create notifications" ON notifications
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;
CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = recipient_id);

DROP POLICY IF EXISTS "Users can delete own notifications" ON notifications;
CREATE POLICY "Users can delete own notifications" ON notifications
  FOR DELETE USING (auth.uid() = recipient_id);

-- ============================================================
-- SECTION 6: REALTIME PUBLICATIONS
-- ============================================================

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    CREATE PUBLICATION supabase_realtime;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'notifications'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'project_messages'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE project_messages;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'kanban_cards'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE kanban_cards;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'connections'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE connections;
  END IF;
END $$;

-- ============================================================
-- SECTION 7: STORAGE BUCKETS
-- ============================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('avatars',       'avatars',       true,  5242880,  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('covers',        'covers',        true,  10485760, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('post-images',   'post-images',   true,  5242880,  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('startup-logos', 'startup-logos', true,  5242880,  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']),
  ('project-files', 'project-files', false, 52428800, NULL)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for public buckets
DROP POLICY IF EXISTS "Public read avatars" ON storage.objects;
CREATE POLICY "Public read avatars" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Authenticated users upload avatars" ON storage.objects;
CREATE POLICY "Authenticated users upload avatars" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users delete own avatars" ON storage.objects;
CREATE POLICY "Users delete own avatars" ON storage.objects
  FOR DELETE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "Public read covers" ON storage.objects;
CREATE POLICY "Public read covers" ON storage.objects
  FOR SELECT USING (bucket_id = 'covers');

DROP POLICY IF EXISTS "Authenticated users upload covers" ON storage.objects;
CREATE POLICY "Authenticated users upload covers" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'covers' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Public read post images" ON storage.objects;
CREATE POLICY "Public read post images" ON storage.objects
  FOR SELECT USING (bucket_id = 'post-images');

DROP POLICY IF EXISTS "Authenticated users upload post images" ON storage.objects;
CREATE POLICY "Authenticated users upload post images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'post-images' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Public read startup logos" ON storage.objects;
CREATE POLICY "Public read startup logos" ON storage.objects
  FOR SELECT USING (bucket_id = 'startup-logos');

DROP POLICY IF EXISTS "Authenticated users upload startup logos" ON storage.objects;
CREATE POLICY "Authenticated users upload startup logos" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'startup-logos' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Project members read project files" ON storage.objects;
CREATE POLICY "Project members read project files" ON storage.objects
  FOR SELECT USING (bucket_id = 'project-files' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users upload project files" ON storage.objects;
CREATE POLICY "Authenticated users upload project files" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'project-files' AND auth.role() = 'authenticated');

-- ============================================================
-- SECTION 8: SEED DATA
-- 8.0: Create seed auth.users (enables foreign key checks and direct login with Password123!)
-- ============================================================

INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES
  ('00000000-0000-0000-0000-000000000000', 'a1111111-1111-1111-1111-111111111111', 'authenticated', 'authenticated', 'maya.lin@stanford.edu',     crypt('Password123!', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{"full_name":"Maya Lin"}', NOW(), NOW(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', 'a2222222-2222-2222-2222-222222222222', 'authenticated', 'authenticated', 'dwash@berkeley.edu',         crypt('Password123!', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{"full_name":"Devante Washington"}', NOW(), NOW(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', 'a3333333-3333-3333-3333-333333333333', 'authenticated', 'authenticated', 'ananya@gatech.edu',          crypt('Password123!', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{"full_name":"Ananya Sharma"}', NOW(), NOW(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', 'a4444444-4444-4444-4444-444444444444', 'authenticated', 'authenticated', 'liam.vance@mit.edu',         crypt('Password123!', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{"full_name":"Liam Vance"}', NOW(), NOW(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', 'a5555555-5555-5555-5555-555555555555', 'authenticated', 'authenticated', 'sofia.rodriguez@cmu.edu',    crypt('Password123!', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{"full_name":"Sofia Rodriguez"}', NOW(), NOW(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', 'a6666666-6666-6666-6666-666666666666', 'authenticated', 'authenticated', 'kai.tanaka@utexas.edu',      crypt('Password123!', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{"full_name":"Kai Tanaka"}', NOW(), NOW(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', 'a7777777-7777-7777-7777-777777777777', 'authenticated', 'authenticated', 'marcus@berkeley.edu',        crypt('Password123!', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{"full_name":"Marcus Sterling"}', NOW(), NOW(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', 'a8888888-8888-8888-8888-888888888888', 'authenticated', 'authenticated', 'elena.rostova@stanford.edu', crypt('Password123!', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{"full_name":"Elena Rostova"}', NOW(), NOW(), '', '', '', '')
ON CONFLICT (id) DO NOTHING;

INSERT INTO profiles (
  id, email, full_name, avatar_url, cover_image_url,
  bio, college, year_of_study, city,
  github_url, portfolio_url, twitter_url, linkedin_url,
  looking_for, interests,
  is_onboarded, profile_completeness, connection_count, post_count
) VALUES
  (
    'a1111111-1111-1111-1111-111111111111',
    'maya.lin@stanford.edu', 'Maya Lin',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
    'Crafting delightful hackathon MVPs with pixel-perfect interactions. Won 1st place @ TreeHacks ''24. Ready to build something wild with hungry backend hackers!',
    'Stanford University', '3rd Year', 'Palo Alto, CA',
    'https://github.com/mayacodes', 'https://maya.design',
    'https://twitter.com/mayacodes', 'https://linkedin.com/in/mayalin',
    ARRAY['Hackathon Teammates','Startup Co-founders'], ARRAY['UI/UX','Frontend','Design Systems','Fintech'],
    TRUE, 95, 18, 5
  ),
  (
    'a2222222-2222-2222-2222-222222222222',
    'dwash@berkeley.edu', 'Devante Washington',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80',
    'Go, Rust, PostgreSQL, Docker & Redis. I build resilient APIs and distributed pipelines that do not crash under demo load. CalHacks veteran.',
    'UC Berkeley', '4th Year', 'Berkeley, CA',
    'https://github.com/dwash-dev', 'https://dwash.tech',
    'https://twitter.com/dwash_dev', 'https://linkedin.com/in/devante-washington',
    ARRAY['Hackathon Teammates','Project Collaborators'], ARRAY['Distributed Systems','Backend','High Throughput','Web3'],
    TRUE, 90, 24, 7
  ),
  (
    'a3333333-3333-3333-3333-333333333333',
    'ananya@gatech.edu', 'Ananya Sharma',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80',
    'Zero stage fright. 2x TEDx youth speaker, product manager, and slide deck architect. I handle the story, customer validation, and live demo pitch.',
    'Georgia Tech', '2nd Year', 'Atlanta, GA',
    'https://github.com/ananyasharma', 'https://ananyaspeaks.com',
    'https://twitter.com/ananya_speaks', 'https://linkedin.com/in/ananyasharma',
    ARRAY['Startup Co-founders','Hackathon Teammates','Mentorship'], ARRAY['Pitching','Product Management','EdTech','AI ethics'],
    TRUE, 88, 31, 4
  ),
  (
    'a4444444-4444-4444-4444-444444444444',
    'liam.vance@mit.edu', 'Liam Vance',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&auto=format&fit=crop&q=80',
    'Full-stack builder passionate about low-latency web apps and WebAssembly. HackMIT organizer. Always shipping before the clock runs out.',
    'MIT', '3rd Year', 'Cambridge, MA',
    'https://github.com/liamvance', 'https://liam.codes',
    'https://twitter.com/liamv', 'https://linkedin.com/in/liam-vance',
    ARRAY['Hackathon Teammates','Study Partners'], ARRAY['Full-Stack','Compilers','Open Source'],
    TRUE, 92, 40, 6
  ),
  (
    'a5555555-5555-5555-5555-555555555555',
    'sofia.rodriguez@cmu.edu', 'Sofia Rodriguez',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&auto=format&fit=crop&q=80',
    'Fine-tuning LLMs, vision transformers, and multimodal agents. Researching at CMU LTI. Looking for fullstack wizards to build AI apps that matter.',
    'Carnegie Mellon (CMU)', '4th Year', 'Pittsburgh, PA',
    'https://github.com/sofiarodriguez', 'https://sofia.ai',
    'https://twitter.com/sofia_ai', 'https://linkedin.com/in/sofia-rodriguez-ai',
    ARRAY['Startup Co-founders','Hackathon Teammates'], ARRAY['Machine Learning','Computer Vision','GenAI','Healthcare'],
    TRUE, 94, 27, 8
  ),
  (
    'a6666666-6666-6666-6666-666666666666',
    'kai.tanaka@utexas.edu', 'Kai Tanaka',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80',
    'Mobile engineer building silky smooth cross-platform applications in Flutter & Swift. Obsessed with 120fps animations and offline-first state.',
    'UT Austin', '2nd Year', 'Austin, TX',
    'https://github.com/kaizen-dev', 'https://kai.dev',
    'https://twitter.com/kaizen_dev', 'https://linkedin.com/in/kaitanaka',
    ARRAY['Hackathon Teammates','Project Collaborators'], ARRAY['Mobile Dev','Flutter','Swift','UI Animations'],
    TRUE, 85, 14, 3
  ),
  (
    'a7777777-7777-7777-7777-777777777777',
    'marcus@berkeley.edu', 'Marcus Sterling',
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80',
    'Cloud architect and Kubernetes wrangler. Terraform, AWS, automated CI/CD and zero-downtime deployments. Let me handle the infra while you build!',
    'UC Berkeley', '3rd Year', 'Berkeley, CA',
    'https://github.com/marcus-builds', 'https://marcus.cloud',
    'https://twitter.com/marcus_infra', 'https://linkedin.com/in/marcussterling',
    ARRAY['Hackathon Teammates','Startup Co-founders'], ARRAY['DevOps','Cloud','Kubernetes','Security'],
    TRUE, 87, 20, 2
  ),
  (
    'a8888888-8888-8888-8888-888888888888',
    'elena.rostova@stanford.edu', 'Elena Rostova',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&auto=format&fit=crop&q=80',
    'CTF player, cryptography nerd, and application security analyst. I make sure our hackathon submission does not leak user secrets or fail security reviews.',
    'Stanford University', '1st Year', 'Stanford, CA',
    'https://github.com/elenarostova', 'https://elena.security',
    'https://twitter.com/elena_sec', 'https://linkedin.com/in/elena-rostova',
    ARRAY['Study Partners','Hackathon Teammates','Mentorship'], ARRAY['Cybersecurity','Cryptography','Reverse Engineering'],
    TRUE, 82, 11, 2
  )
ON CONFLICT (id) DO UPDATE SET
  full_name             = EXCLUDED.full_name,
  avatar_url            = EXCLUDED.avatar_url,
  cover_image_url       = EXCLUDED.cover_image_url,
  bio                   = EXCLUDED.bio,
  college               = EXCLUDED.college,
  year_of_study         = EXCLUDED.year_of_study,
  city                  = EXCLUDED.city,
  github_url            = EXCLUDED.github_url,
  portfolio_url         = EXCLUDED.portfolio_url,
  looking_for           = EXCLUDED.looking_for,
  interests             = EXCLUDED.interests,
  is_onboarded          = EXCLUDED.is_onboarded,
  profile_completeness  = EXCLUDED.profile_completeness,
  connection_count      = EXCLUDED.connection_count,
  post_count            = EXCLUDED.post_count;

-- SKILLS
INSERT INTO user_skills (user_id, skill_name, proficiency, is_primary, display_order) VALUES
  ('a1111111-1111-1111-1111-111111111111', 'UI/UX Design',                  'Expert',       TRUE,  1),
  ('a1111111-1111-1111-1111-111111111111', 'Frontend',                       'Advanced',     TRUE,  2),
  ('a1111111-1111-1111-1111-111111111111', 'Prototyping (Figma, Adobe XD)',   'Expert',       TRUE,  3),
  ('a1111111-1111-1111-1111-111111111111', 'Product Design',                  'Advanced',     FALSE, 4),
  ('a2222222-2222-2222-2222-222222222222', 'Backend',                         'Expert',       TRUE,  1),
  ('a2222222-2222-2222-2222-222222222222', 'System Design',                   'Advanced',     TRUE,  2),
  ('a2222222-2222-2222-2222-222222222222', 'Database Management',             'Expert',       TRUE,  3),
  ('a2222222-2222-2222-2222-222222222222', 'DevOps',                          'Intermediate', FALSE, 4),
  ('a3333333-3333-3333-3333-333333333333', 'Pitching/Presenting',             'Expert',       TRUE,  1),
  ('a3333333-3333-3333-3333-333333333333', 'Project Management',              'Advanced',     TRUE,  2),
  ('a3333333-3333-3333-3333-333333333333', 'Content Creation',                'Advanced',     TRUE,  3),
  ('a3333333-3333-3333-3333-333333333333', 'UI/UX Design',                    'Beginner',     FALSE, 4),
  ('a4444444-4444-4444-4444-444444444444', 'Full-Stack',                      'Expert',       TRUE,  1),
  ('a4444444-4444-4444-4444-444444444444', 'Frontend',                        'Advanced',     TRUE,  2),
  ('a4444444-4444-4444-4444-444444444444', 'Backend',                         'Advanced',     TRUE,  3),
  ('a5555555-5555-5555-5555-555555555555', 'Machine Learning',                'Expert',       TRUE,  1),
  ('a5555555-5555-5555-5555-555555555555', 'Deep Learning',                   'Expert',       TRUE,  2),
  ('a5555555-5555-5555-5555-555555555555', 'Data Science',                    'Advanced',     TRUE,  3),
  ('a6666666-6666-6666-6666-666666666666', 'Mobile (React Native, Flutter)',   'Expert',       TRUE,  1),
  ('a6666666-6666-6666-6666-666666666666', 'Frontend',                        'Intermediate', TRUE,  2),
  ('a6666666-6666-6666-6666-666666666666', 'UI/UX Design',                    'Intermediate', TRUE,  3),
  ('a7777777-7777-7777-7777-777777777777', 'DevOps',                          'Expert',       TRUE,  1),
  ('a7777777-7777-7777-7777-777777777777', 'Cloud (AWS/GCP/Azure)',            'Expert',       TRUE,  2),
  ('a7777777-7777-7777-7777-777777777777', 'System Design',                   'Advanced',     TRUE,  3),
  ('a8888888-8888-8888-8888-888888888888', 'Cybersecurity',                   'Advanced',     TRUE,  1),
  ('a8888888-8888-8888-8888-888888888888', 'Penetration Testing',             'Intermediate', TRUE,  2),
  ('a8888888-8888-8888-8888-888888888888', 'Cryptography',                    'Advanced',     TRUE,  3)
ON CONFLICT (user_id, skill_name) DO NOTHING;

-- POSTS
INSERT INTO posts (id, author_id, post_type, title, content, images, tags, visibility, like_count, comment_count, bookmark_count) VALUES
  (
    'b1111111-1111-1111-1111-111111111111',
    'a1111111-1111-1111-1111-111111111111',
    'hackathon_experience',
    'How our 3-person team won TreeHacks ''24 in 36 hours',
    'Here is the breakdown of how we scoped, designed, and presented SynapseAI at TreeHacks:

1. Lock down the user flow in Figma within the first 4 hours.
2. Do NOT build a custom auth system—use Supabase immediately.
3. Rehearse the 3-minute pitch 10 times before judges arrive. Judges judge narrative as much as code!',
    ARRAY['https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&auto=format&fit=crop&q=80'],
    ARRAY['TreeHacks','UI/UX Design','Hackathon'],
    'public', 42, 6, 12
  ),
  (
    'b2222222-2222-2222-2222-222222222222',
    'a2222222-2222-2222-2222-222222222222',
    'tutorial',
    'Zero-Crash Hackathon Architecture: Redis + PostgreSQL + WebSockets',
    'Tired of demo-day servers falling over when 5 judges try your site at once? Here is a bulletproof Node.js template using Redis pub/sub and rate limiting that survived 10,000 requests per minute with zero dropped sockets. Repo link in comments!',
    ARRAY['https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80'],
    ARRAY['Backend','System Design','Go','Redis'],
    'public', 58, 9, 21
  ),
  (
    'b3333333-3333-3333-3333-333333333333',
    'a3333333-3333-3333-3333-333333333333',
    'achievement',
    'The 3-Minute Demo Formula That Won 4 Hackathons in a Row',
    'Most engineers make the mistake of showing terminal logs or registration screens during hackathon pitches. Never do that! Start with the problem in 20 seconds, show the "magic moment" in 60 seconds, highlight the tech moat in 40 seconds, and close with future vision.',
    ARRAY['https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&auto=format&fit=crop&q=80'],
    ARRAY['Pitching','Hackathon','Storytelling'],
    'public', 74, 15, 33
  ),
  (
    'b4444444-4444-4444-4444-444444444444',
    'a5555555-5555-5555-5555-555555555555',
    'project_showcase',
    'OpenScribe: Edge AI Note-Taker for Lecture Halls',
    'Just deployed OpenScribe v0.8. Transcribes classroom audio locally in real-time using Whisper-tiny via WebAssembly with zero data sent to external servers. Looking for mobile contributors!',
    ARRAY['https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80'],
    ARRAY['Machine Learning','Open Source','WebAssembly'],
    'public', 65, 8, 19
  )
ON CONFLICT (id) DO NOTHING;

-- STARTUPS
INSERT INTO startups (
  id, founder_id, name, one_liner, problem_statement, solution, description,
  tech_stack, roles_needed, stage, logo_url, website_url, application_count, member_count
) VALUES
  (
    'c1111111-1111-1111-1111-111111111111',
    'a1111111-1111-1111-1111-111111111111',
    'CollabStudio',
    'Figma for hardware engineers and collegiate robotics teams',
    'Hardware teams struggle with fragmented CAD files, spreadsheet BOMs, and lack of real-time collaborative review during rapid prototyping sprints.',
    'A browser-native WebGL platform enabling multi-user 3D assembly inspection, version-controlled BOMs, and instant supplier pricing integration.',
    'We started building this after winning CalHacks and have 12 collegiate robotics teams in our pilot program. Seeking a dedicated backend distributed systems co-founder and a hardware CAD enthusiast.',
    ARRAY['Next.js','Three.js','Go','PostgreSQL','Docker'],
    ARRAY['Backend','DevOps','System Design'],
    'building_mvp',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
    'https://collabstudio.dev',
    5, 2
  ),
  (
    'c2222222-2222-2222-2222-222222222222',
    'a5555555-5555-5555-5555-555555555555',
    'MedCognition',
    'Real-time diagnostic assistance for student clinic triaging',
    'Student-run health clinics in underserved areas face hours-long wait times and overburdened volunteer clinicians.',
    'Privacy-first, HIPAA-compliant on-device triage assistant that summarizes vitals and flags urgent differential diagnoses.',
    'Currently piloting with CMU Health Services. Winner of CMU Venture Challenge 2024. Backed by university innovation grant.',
    ARRAY['Python','PyTorch','FastAPI','React Native','PostgreSQL'],
    ARRAY['Full-Stack','Mobile (React Native, Flutter)','Pitching/Presenting'],
    'mvp_ready',
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=200&auto=format&fit=crop&q=80',
    'https://medcognition.health',
    8, 3
  )
ON CONFLICT (id) DO NOTHING;

-- STARTUP MEMBERS (founders auto-added)
INSERT INTO startup_members (startup_id, user_id, role, is_founder) VALUES
  ('c1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 'Founder & UI Lead', TRUE),
  ('c2222222-2222-2222-2222-222222222222', 'a5555555-5555-5555-5555-555555555555', 'Founder & ML Lead', TRUE)
ON CONFLICT (startup_id, user_id) DO NOTHING;

-- PROJECTS
INSERT INTO projects (id, creator_id, name, description, hackathon_name, project_type, deadline, member_count) VALUES
  (
    'd1111111-1111-1111-1111-111111111111',
    'a1111111-1111-1111-1111-111111111111',
    'CalHacks 11.0: PulseWave',
    'High-frequency telemetry and health anomaly prediction during extreme student hackathon sprints.',
    'CalHacks 11.0', 'hackathon',
    NOW() + INTERVAL '14 days', 3
  ),
  (
    'd2222222-2222-2222-2222-222222222222',
    'a4444444-4444-4444-4444-444444444444',
    'HackCampus Open Source',
    'Unified student identity and skill graph protocol for decentralized university clubs.',
    'HackMIT', 'open_source',
    NOW() + INTERVAL '30 days', 4
  )
ON CONFLICT (id) DO NOTHING;

-- PROJECT MEMBERS
INSERT INTO project_members (project_id, user_id, role) VALUES
  ('d1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 'lead'),
  ('d1111111-1111-1111-1111-111111111111', 'a2222222-2222-2222-2222-222222222222', 'backend'),
  ('d1111111-1111-1111-1111-111111111111', 'a3333333-3333-3333-3333-333333333333', 'presenter')
ON CONFLICT (project_id, user_id) DO NOTHING;

-- KANBAN CARDS
INSERT INTO kanban_cards (id, project_id, created_by, assigned_to, title, description, status, priority, display_order) VALUES
  ('e1111111-1111-1111-1111-111111111111', 'd1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111',
   'Finalize Figma design tokens & dark mode', 'Complete color system, typography scale, and card states according to Stitch specs.', 'done', 2, 1),
  ('e2222222-2222-2222-2222-222222222222', 'd1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 'a2222222-2222-2222-2222-222222222222',
   'Implement WebSocket real-time telemetry stream', 'Set up socket listener for live sensor heartbeat data with backpressure control.', 'in_progress', 3, 1),
  ('e3333333-3333-3333-3333-333333333333', 'd1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 'a3333333-3333-3333-3333-333333333333',
   'Structure 3-minute pitch deck narrative', 'Create hook, problem slides, architecture diagram, and demo flow for judges.', 'todo', 3, 1),
  ('e4444444-4444-4444-4444-444444444444', 'd1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 'a2222222-2222-2222-2222-222222222222',
   'PostgreSQL database indexing for discovery feed', 'Ensure pg_trgm indices on full_name and college for sub-10ms queries.', 'review', 1, 1)
ON CONFLICT (id) DO NOTHING;

-- PROJECT MESSAGES
INSERT INTO project_messages (id, project_id, sender_id, content) VALUES
  ('f1111111-1111-1111-1111-111111111111', 'd1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111',
   'Hey team! Welcome to the CalHacks workspace. Figma mockups are uploaded to the files tab.'),
  ('f2222222-2222-2222-2222-222222222222', 'd1111111-1111-1111-1111-111111111111', 'a2222222-2222-2222-2222-222222222222',
   'Checked out the mockups, looks crisp! Setting up the PostgreSQL schema and Redis pub/sub now.'),
  ('f3333333-3333-3333-3333-333333333333', 'd1111111-1111-1111-1111-111111111111', 'a3333333-3333-3333-3333-333333333333',
   'I started drafting the problem statement for our submission. The focus is on real-time biometric anomalies.')
ON CONFLICT (id) DO NOTHING;

-- PROJECT LINKS
INSERT INTO project_links (id, project_id, added_by, title, url, description) VALUES
  ('l1111111-1111-1111-1111-111111111111', 'd1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111',
   'Figma Workspace Specs', 'https://figma.com/@hackconnect/pulsewave', 'Official UI Kit and interaction flows'),
  ('l2222222-2222-2222-2222-222222222222', 'd1111111-1111-1111-1111-111111111111', 'a2222222-2222-2222-2222-222222222222',
   'API Documentation & OpenAPI Specs', 'https://api.pulsewave.dev/docs', 'Interactive Swagger endpoints for streaming ingestion')
ON CONFLICT (id) DO NOTHING;

-- PROJECT NOTES
INSERT INTO project_notes (id, project_id, title, content, last_edited_by) VALUES
  ('n1111111-1111-1111-1111-111111111111', 'd1111111-1111-1111-1111-111111111111',
   'Judging Criteria & Pitch Checklist',
   '### CalHacks 11.0 Judging Priorities
- **Technical Depth (35%)**: Custom distributed telemetry pipeline.
- **Design & Polish (25%)**: Pixel-perfect Stitch design system with responsive charts.
- **Practical Impact (25%)**: Real problem faced by student developers.
- **Pitch & Q&A (15%)**: Keep answers under 30 seconds with concrete data.',
   'a3333333-3333-3333-3333-333333333333')
ON CONFLICT (id) DO NOTHING;
