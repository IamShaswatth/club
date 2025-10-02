-- Additional SQL commands to add initial data for testing
-- Run this AFTER the main database-setup.sql

-- STEP 1: Insert admin user FIRST (required for foreign key references)
-- Insert admin user with hashed password for 'password123'
-- Note: In production, you'd use proper password hashing. This is a bcrypt hash for 'password123'
INSERT INTO users (id, email, name, role, password_hash, student_id) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'admin@college.edu', 'Admin User', 'admin', '$2b$10$rOQHmTvr2/Fkj3Z6N.Q7V.8B8pF9D5r7nM3Y8K6L1W9X4S2T6U8G0', NULL)
ON CONFLICT (email) DO UPDATE SET
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    password_hash = EXCLUDED.password_hash;

-- STEP 2: Insert clubs with proper UUIDs
INSERT INTO clubs (id, name, description) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 'CCC', 'Computer Coding Club'),
    ('550e8400-e29b-41d4-a716-446655440002', 'IELTS', 'International English Language Testing System'),
    ('550e8400-e29b-41d4-a716-446655440003', 'EPRC', 'English Proficiency Resource Center'),
    ('550e8400-e29b-41d4-a716-446655440004', 'IEF', 'Innovation and Entrepreneurship Forum'),
    ('550e8400-e29b-41d4-a716-446655440005', 'Cultural and Music Club', 'Cultural activities and music performances')
ON CONFLICT (id) DO UPDATE SET 
    name = EXCLUDED.name,
    description = EXCLUDED.description;

-- STEP 3: Insert sample events (now that admin user exists)
INSERT INTO events (id, name, organizing_club_id, venue, date, time, created_by) VALUES
    ('550e8400-e29b-41d4-a716-446655441001', 'Coding Championship', '550e8400-e29b-41d4-a716-446655440001', 'Computer Lab A', '2025-11-15', '10:00', '550e8400-e29b-41d4-a716-446655440000'),
    ('550e8400-e29b-41d4-a716-446655441002', 'UI/UX Design Competition', '550e8400-e29b-41d4-a716-446655440001', 'Design Studio', '2025-11-20', '14:00', '550e8400-e29b-41d4-a716-446655440000'),
    ('550e8400-e29b-41d4-a716-446655441003', 'Cultural Night', '550e8400-e29b-41d4-a716-446655440005', 'Main Auditorium', '2025-12-05', '18:00', '550e8400-e29b-41d4-a716-446655440000')
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    organizing_club_id = EXCLUDED.organizing_club_id,
    venue = EXCLUDED.venue,
    date = EXCLUDED.date,
    time = EXCLUDED.time;

-- Verify the data was inserted
SELECT 'Clubs' as table_name, COUNT(*) as count FROM clubs
UNION ALL
SELECT 'Users' as table_name, COUNT(*) as count FROM users
UNION ALL  
SELECT 'Events' as table_name, COUNT(*) as count FROM events;