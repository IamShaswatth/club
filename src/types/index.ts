export interface User {
  id: string;
  email: string;
  name: string;
  password?: string; // Password for authentication (in production, this would be hashed)
  studentId?: string; // Unique student ID for students
  role: 'admin' | 'student';
  created_at: string;
}

export interface Club {
  id: string;
  name: string;
  description: string;
  created_at: string;
}

export interface Event {
  id: string;
  name: string;
  organizing_club_id: string;
  organizing_club?: Club;
  venue: string;
  date: string;
  time: string;
  created_by: string;
  created_at: string;
}

export interface EventRegistration {
  id: string;
  user_id: string;
  event_id: string;
  user?: User;
  event?: Event;
  registered_at: string;
}

export interface ClubRegistration {
  id: string;
  user_id: string;
  club_id: string;
  status: 'pending' | 'approved' | 'rejected';
  user?: User;
  club?: Club;
  requested_at: string;
  approved_at?: string;
}