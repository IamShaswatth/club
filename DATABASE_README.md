# Club Management System with Database

This project now includes real database connectivity using Supabase (PostgreSQL).

## Database Setup Instructions

### 1. Create a Supabase Account
1. Go to [https://supabase.com](https://supabase.com)
2. Sign up for a free account
3. Create a new project

### 2. Set up the Database
1. In your Supabase dashboard, go to the SQL Editor
2. Copy and paste the contents of `database-setup.sql`
3. Run the SQL commands to create tables and initial data

### 3. Configure Environment Variables
1. In your Supabase dashboard, go to Settings > API
2. Copy your Project URL and anon public key
3. Update the `.env` file with your actual values:
   ```
   VITE_SUPABASE_URL=your_actual_supabase_url
   VITE_SUPABASE_ANON_KEY=your_actual_anon_key
   ```

### 4. Install Dependencies and Run
```bash
npm install
npm run dev
```

## Database Features

### ✅ What's Now Stored in Database:
- **User Registration**: New user signups are stored in Supabase `users` table
- **User Authentication**: Login verification against database
- **Password Security**: Passwords are hashed using SHA-256
- **Unique Student IDs**: Auto-generated for each student
- **Data Persistence**: User data persists across sessions and devices

### 🏗️ Database Schema:
- `users` - User accounts with authentication
- `clubs` - Club information
- `events` - Event details
- `event_registrations` - Student event registrations
- `club_registrations` - Student club membership requests

### 🔐 Security Features:
- Row Level Security (RLS) enabled
- Password hashing
- Environment variable configuration
- Input validation

## Usage

### For New Users:
1. Click "Create Account" on login page
2. Fill in name, email, and password
3. Account is created in database with unique student ID
4. Automatic login after successful registration

### For Admins:
- Default admin account: `admin@college.edu` / `password123`
- Can download CSV files with real student data
- Manage events and club registrations

### CSV Download:
When admins download event registration CSVs, they now contain:
- Student ID (e.g., STU2574ABC)
- Student Name
- Email Address
- Registration Date & Time

## Development vs Production

### Current Setup (Development):
- Uses Supabase free tier
- Environment variables in `.env` file
- Simple SHA-256 password hashing

### For Production:
- Use stronger password hashing (bcrypt)
- Set environment variables in hosting platform
- Enable additional security features
- Add email verification
- Implement proper session management

## Troubleshooting

### Common Issues:
1. **Environment Variables**: Make sure `.env` file has correct Supabase credentials
2. **Database Tables**: Ensure all SQL commands from `database-setup.sql` ran successfully
3. **CORS Issues**: Check Supabase project settings if having connection issues

### Error Messages:
- "Missing Supabase environment variables" - Check `.env` file
- "Invalid email or password" - User not found in database or wrong password
- "User with this email already exists" - Email already registered

## Next Steps

To fully integrate the database:
1. Update DataContext to use Supabase for clubs, events, and registrations
2. Implement real-time updates using Supabase subscriptions
3. Add email verification for new users
4. Implement password reset functionality