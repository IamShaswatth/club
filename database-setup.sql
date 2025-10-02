-- Supabase Database Setup
-- Run these commands in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    student_id VARCHAR(50) UNIQUE,
    role VARCHAR(20) CHECK (role IN ('admin', 'student')) DEFAULT 'student',
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create clubs table
CREATE TABLE IF NOT EXISTS clubs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Clean up any duplicate clubs and add unique constraint
DO $$ 
BEGIN
    -- First, drop the constraint if it exists
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'clubs_name_key' AND table_name = 'clubs'
    ) THEN
        ALTER TABLE clubs DROP CONSTRAINT clubs_name_key;
    END IF;
    
    -- Remove ALL duplicate clubs, keeping only the first one per name
    DELETE FROM clubs 
    WHERE id NOT IN (
        SELECT DISTINCT ON (LOWER(TRIM(name))) id 
        FROM clubs 
        ORDER BY LOWER(TRIM(name)), created_at
    );
    
    -- Now add the unique constraint
    ALTER TABLE clubs ADD CONSTRAINT clubs_name_key UNIQUE (name);
END $$;

-- Create events table
CREATE TABLE IF NOT EXISTS events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    organizing_club_id UUID REFERENCES clubs(id) ON DELETE CASCADE,
    venue VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    created_by UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Clean up any duplicate events and add unique constraint
DO $$ 
BEGIN
    -- First, drop the constraint if it exists
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'events_name_key' AND table_name = 'events'
    ) THEN
        ALTER TABLE events DROP CONSTRAINT events_name_key;
    END IF;
    
    -- Remove ALL duplicate events, keeping only the first one per name
    DELETE FROM events 
    WHERE id NOT IN (
        SELECT DISTINCT ON (LOWER(TRIM(name))) id 
        FROM events 
        ORDER BY LOWER(TRIM(name)), created_at
    );
    
    -- Now add the unique constraint
    ALTER TABLE events ADD CONSTRAINT events_name_key UNIQUE (name);
END $$;

-- Create event_registrations table
CREATE TABLE IF NOT EXISTS event_registrations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id, event_id)
);

-- Create club_registrations table
CREATE TABLE IF NOT EXISTS club_registrations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    club_id UUID REFERENCES clubs(id) ON DELETE CASCADE,
    status VARCHAR(20) CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
    requested_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    approved_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(user_id, club_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_student_id ON users(student_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_user_id ON event_registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_event_id ON event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_club_registrations_user_id ON club_registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_club_registrations_club_id ON club_registrations(club_id);

-- Insert default data
DO $$
DECLARE
    admin_id UUID;
    club_ccc_id UUID;
    club_music_id UUID;
BEGIN
    -- Insert admin user if not exists
    IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@college.edu') THEN
        INSERT INTO users (email, name, role, password_hash, student_id) 
        VALUES ('admin@college.edu', 'Admin User', 'admin', '$2b$10$rOQHmTvr2/Fkj3Z6N.Q7V.8B8pF9D5r7nM3Y8K6L1W9X4S2T6U8G0', NULL);
    END IF;
    
    -- Get admin user ID
    SELECT id INTO admin_id FROM users WHERE email = 'admin@college.edu';

    -- Insert clubs if they don't exist
    IF NOT EXISTS (SELECT 1 FROM clubs WHERE name = 'CCC') THEN
        INSERT INTO clubs (name, description) VALUES ('CCC', 'Computer Coding Club');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM clubs WHERE name = 'IELTS') THEN
        INSERT INTO clubs (name, description) VALUES ('IELTS', 'International English Language Testing System');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM clubs WHERE name = 'EPRC') THEN
        INSERT INTO clubs (name, description) VALUES ('EPRC', 'English Proficiency Resource Center');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM clubs WHERE name = 'IEF') THEN
        INSERT INTO clubs (name, description) VALUES ('IEF', 'Innovation and Entrepreneurship Forum');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM clubs WHERE name = 'Cultural and Music Club') THEN
        INSERT INTO clubs (name, description) VALUES ('Cultural and Music Club', 'Cultural activities and music performances');
    END IF;

    -- Get club IDs
    SELECT id INTO club_ccc_id FROM clubs WHERE name = 'CCC';
    SELECT id INTO club_music_id FROM clubs WHERE name = 'Cultural and Music Club';

    -- Insert sample events if they don't exist
    IF NOT EXISTS (SELECT 1 FROM events WHERE name = 'Coding Championship') THEN
        INSERT INTO events (name, organizing_club_id, venue, date, time, created_by) 
        VALUES ('Coding Championship', club_ccc_id, 'Computer Lab A', '2025-11-15', '10:00', admin_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM events WHERE name = 'UI/UX Design Competition') THEN
        INSERT INTO events (name, organizing_club_id, venue, date, time, created_by) 
        VALUES ('UI/UX Design Competition', club_ccc_id, 'Design Studio', '2025-11-20', '14:00', admin_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM events WHERE name = 'Cultural Night') THEN
        INSERT INTO events (name, organizing_club_id, venue, date, time, created_by) 
        VALUES ('Cultural Night', club_music_id, 'Main Auditorium', '2025-12-05', '18:00', admin_id);
    END IF;

END $$;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for users table
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE club_registrations ENABLE ROW LEVEL SECURITY;

-- Create policies for Row Level Security
-- Drop existing policies first
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Anyone can view clubs" ON clubs;
DROP POLICY IF EXISTS "Anyone can view events" ON events;
DROP POLICY IF EXISTS "Admin can insert clubs" ON clubs;
DROP POLICY IF EXISTS "Admin can insert events" ON events;
DROP POLICY IF EXISTS "Users can view own registrations" ON event_registrations;
DROP POLICY IF EXISTS "Users can insert own registrations" ON event_registrations;
DROP POLICY IF EXISTS "Users can view own club registrations" ON club_registrations;
DROP POLICY IF EXISTS "Users can insert own club registrations" ON club_registrations;
DROP POLICY IF EXISTS "Admin can manage all registrations" ON event_registrations;
DROP POLICY IF EXISTS "Admin can manage all club registrations" ON club_registrations;

-- Users can read their own data
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (true);
CREATE POLICY "Users can insert own profile" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (true);

-- Everyone can read clubs and events
CREATE POLICY "Anyone can view clubs" ON clubs FOR SELECT USING (true);
CREATE POLICY "Anyone can view events" ON events FOR SELECT USING (true);

-- Admin can insert clubs and events
CREATE POLICY "Admin can insert clubs" ON clubs FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can insert events" ON events FOR INSERT WITH CHECK (true);

-- Users can manage their own registrations
CREATE POLICY "Users can view own registrations" ON event_registrations FOR SELECT USING (true);
CREATE POLICY "Users can insert own registrations" ON event_registrations FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view own club registrations" ON club_registrations FOR SELECT USING (true);
CREATE POLICY "Users can insert own club registrations" ON club_registrations FOR INSERT WITH CHECK (true);

-- Admin can manage all registrations
CREATE POLICY "Admin can manage all registrations" ON event_registrations FOR ALL USING (true);
CREATE POLICY "Admin can manage all club registrations" ON club_registrations FOR ALL USING (true);