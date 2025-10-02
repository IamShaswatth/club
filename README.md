# Club Management System

A modern web application for managing college clubs, events, and student registrations built with React, TypeScript, and Supabase.

## Features

- **User Authentication**: Secure signup/login system with role-based access (Admin/Student)
- **Club Management**: Create and manage college clubs
- **Event Management**: Admins can create events and track registrations
- **Student Registration**: Students can register for events and join clubs
- **CSV Export**: Admins can download registration data as CSV files
- **Real-time Database**: All data stored in Supabase PostgreSQL database

## Tech Stack

- **Frontend**: React 18.3.1 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Custom auth with bcrypt password hashing
- **Icons**: Lucide React

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/IamShaswatth/club.git
   cd club
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new project on [Supabase](https://supabase.com)
   - Go to Settings → API to get your project URL and anon key

4. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. **Database Setup**
   - Go to your Supabase dashboard
   - Navigate to SQL Editor
   - Copy and paste the entire content from `database-setup.sql`
   - Click "Run" to execute the SQL commands

6. **Start the development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`

## Database Schema

### Tables

- **users**: Stores user information (students and admins)
- **clubs**: College clubs information
- **events**: Events created by admins
- **event_registrations**: Student event registrations
- **club_registrations**: Student club registrations with approval status

### Default Data

The database setup includes:
- Default admin user: `admin@college.edu` (password: `admin123`)
- Sample clubs: CCC, IELTS, EPRC, IEF, Cultural and Music Club
- Sample events for testing

## Usage

### For Admins

1. **Login** with admin credentials
2. **Dashboard**: View statistics and manage system
3. **Create Events**: Add new events with details
4. **Manage Registrations**: Approve/reject club registrations
5. **Download CSV**: Export registration data for events

### For Students

1. **Sign Up**: Create a new student account
2. **Browse Events**: View and register for available events
3. **Join Clubs**: Request to join clubs (requires admin approval)
4. **View Dashboard**: Track your registrations

## Project Structure

```
src/
├── components/
│   ├── admin/
│   │   ├── ClubRegistrations.tsx    # Admin club approval page
│   │   ├── Dashboard.tsx            # Admin dashboard
│   │   └── EventManagement.tsx      # Event creation and CSV export
│   ├── student/
│   │   ├── Clubs.tsx               # Student club registration
│   │   └── Dashboard.tsx           # Student dashboard
│   ├── Layout.tsx                  # Main layout component
│   ├── LoginForm.tsx              # Login/signup form
│   └── Notifications.tsx          # Toast notifications
├── contexts/
│   ├── AuthContext.tsx            # Authentication state management
│   └── DataContext.tsx            # Data fetching and state management
├── lib/
│   ├── supabase.ts               # Supabase client configuration
│   └── auth.ts                   # Authentication utilities
└── types/
    └── index.ts                  # TypeScript type definitions
```

## Key Features Implementation

### Authentication
- Password hashing with bcrypt
- Role-based access control
- Persistent login sessions

### Database Integration
- Real-time data synchronization
- Row Level Security (RLS) policies
- Optimized queries with JOINs for user information

### CSV Export
- Dynamic CSV generation with actual student names
- Event-specific registration data
- Download functionality for admins

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style

- TypeScript strict mode enabled
- ESLint configuration for code quality
- Consistent naming conventions

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Environment Variables

Required environment variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | `https://your-project.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon/public key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify your Supabase credentials in `.env`
   - Ensure database setup SQL has been executed

2. **Login Not Working**
   - Check if the admin user exists in the database
   - Verify password hashing implementation

3. **Registration Not Showing Names**
   - Ensure JOIN queries are working in DataContext
   - Check if user data is properly mapped

### Support

If you encounter any issues:
1. Check the browser console for errors
2. Verify your Supabase setup
3. Ensure all environment variables are set correctly

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [React](https://reactjs.org/) - UI framework
- [Supabase](https://supabase.com/) - Backend as a Service
- [Tailwind CSS](https://tailwindcss.com/) - Styling framework
- [Vite](https://vitejs.dev/) - Build tool
