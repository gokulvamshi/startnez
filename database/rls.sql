-- ============================================================
-- ROW LEVEL SECURITY POLICIES & STORAGE BUCKETS
-- Every table MUST have RLS enabled with appropriate policies
-- ============================================================

-- Enable RLS on all tables
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

-- PROFILES POLICIES
DROP POLICY IF EXISTS "Profiles are viewable by authenticated users" ON profiles;
CREATE POLICY "Profiles are viewable by authenticated users" ON profiles
  FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- USER SKILLS POLICIES
DROP POLICY IF EXISTS "Skills are viewable by authenticated users" ON user_skills;
CREATE POLICY "Skills are viewable by authenticated users" ON user_skills
  FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can manage own skills" ON user_skills;
CREATE POLICY "Users can manage own skills" ON user_skills
  FOR ALL USING (auth.uid() = user_id);

-- CONNECTIONS POLICIES
DROP POLICY IF EXISTS "Users can view own connections" ON connections;
CREATE POLICY "Users can view own connections" ON connections
  FOR SELECT USING (auth.uid() = requester_id OR auth.uid() = receiver_id);

DROP POLICY IF EXISTS "Users can create connection requests" ON connections;
CREATE POLICY "Users can create connection requests" ON connections
  FOR INSERT WITH CHECK (auth.uid() = requester_id);

DROP POLICY IF EXISTS "Users can update connections they're part of" ON connections;
CREATE POLICY "Users can update connections they're part of" ON connections
  FOR UPDATE USING (auth.uid() = receiver_id OR auth.uid() = requester_id);

DROP POLICY IF EXISTS "Users can delete own connection requests" ON connections;
CREATE POLICY "Users can delete own connection requests" ON connections
  FOR DELETE USING (auth.uid() = requester_id OR auth.uid() = receiver_id);

-- POSTS POLICIES
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

-- POST LIKES POLICIES
DROP POLICY IF EXISTS "Likes viewable by authenticated users" ON post_likes;
CREATE POLICY "Likes viewable by authenticated users" ON post_likes
  FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can manage own likes" ON post_likes;
CREATE POLICY "Users can manage own likes" ON post_likes
  FOR ALL USING (auth.uid() = user_id);

-- POST COMMENTS POLICIES
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

-- POST BOOKMARKS POLICIES
DROP POLICY IF EXISTS "Users can manage own bookmarks" ON post_bookmarks;
CREATE POLICY "Users can manage own bookmarks" ON post_bookmarks
  FOR ALL USING (auth.uid() = user_id);

-- STARTUPS POLICIES
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

-- STARTUP MEMBERS POLICIES
DROP POLICY IF EXISTS "Startup members viewable by authenticated users" ON startup_members;
CREATE POLICY "Startup members viewable by authenticated users" ON startup_members
  FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Founders can manage startup members" ON startup_members;
CREATE POLICY "Founders can manage startup members" ON startup_members
  FOR ALL USING (
    EXISTS (SELECT 1 FROM startups WHERE id = startup_members.startup_id AND founder_id = auth.uid())
  );

-- STARTUP APPLICATIONS POLICIES
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

-- PROJECTS POLICIES
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

-- PROJECT MEMBERS POLICIES
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

-- KANBAN CARDS POLICIES
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

-- PROJECT FILES POLICIES
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

-- PROJECT MESSAGES POLICIES
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

-- PROJECT LINKS POLICIES
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

-- PROJECT NOTES POLICIES
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

-- NOTIFICATIONS POLICIES
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

-- REALTIME PUBLICATION
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    CREATE PUBLICATION supabase_realtime;
  END IF;
END $$;

ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE project_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE kanban_cards;
ALTER PUBLICATION supabase_realtime ADD TABLE connections;

-- STORAGE BUCKETS
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('avatars', 'avatars', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('covers', 'covers', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('post-images', 'post-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('startup-logos', 'startup-logos', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']),
  ('project-files', 'project-files', false, 52428800, NULL)
ON CONFLICT (id) DO NOTHING;
