import React, { createContext, useContext, useState, useEffect } from 'react';
import { Club, Event, EventRegistration, ClubRegistration } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface DataContextType {
  clubs: Club[];
  events: Event[];
  eventRegistrations: EventRegistration[];
  clubRegistrations: ClubRegistration[];
  loading: boolean;
  createEvent: (event: Omit<Event, 'id' | 'created_at'>) => Promise<void>;
  registerForEvent: (userId: string, eventId: string) => Promise<void>;
  registerForClub: (userId: string, clubId: string) => Promise<void>;
  approveClubRegistration: (registrationId: string) => Promise<void>;
  rejectClubRegistration: (registrationId: string) => Promise<void>;
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [eventRegistrations, setEventRegistrations] = useState<EventRegistration[]>([]);
  const [clubRegistrations, setClubRegistrations] = useState<ClubRegistration[]>([]);
  const [loading, setLoading] = useState(true);

  // Fallback data for when database is not available
  const fallbackData = {
    clubs: [
      { id: '1', name: 'CCC', description: 'Computer Coding Club', created_at: '2024-01-01' },
      { id: '2', name: 'IELTS', description: 'International English Language Testing System', created_at: '2024-01-01' },
      { id: '3', name: 'EPRC', description: 'English Proficiency Resource Center', created_at: '2024-01-01' },
      { id: '4', name: 'IEF', description: 'Innovation and Entrepreneurship Forum', created_at: '2024-01-01' },
      { id: '5', name: 'Cultural and Music Club', description: 'Cultural activities and music performances', created_at: '2024-01-01' },
    ],
    events: [
      {
        id: '1',
        name: 'Coding Championship',
        organizing_club_id: '1',
        venue: 'Computer Lab A',
        date: '2025-11-15',
        time: '10:00',
        created_by: '1',
        created_at: '2024-01-01',
      },
      {
        id: '2',
        name: 'UI/UX Design Competition',
        organizing_club_id: '1',
        venue: 'Design Studio',
        date: '2025-11-20',
        time: '14:00',
        created_by: '1',
        created_at: '2024-01-01',
      },
    ],
    eventRegistrations: [] as EventRegistration[],
    clubRegistrations: [] as ClubRegistration[],
  };

  // Load data from database or fallback
  const refreshData = async () => {
    setLoading(true);
    try {
      if (isSupabaseConfigured && supabase) {
        // Load from database
        const [clubsData, eventsData, eventRegsData, clubRegsData] = await Promise.all([
          supabase.from('clubs').select('*'),
          supabase.from('events').select('*'),
          supabase.from('event_registrations').select(`
            *,
            users:user_id (
              name,
              email,
              student_id
            )
          `),
          supabase.from('club_registrations').select(`
            *,
            users:user_id (
              name,
              email,
              student_id
            )
          `),
        ]);

        if (clubsData.data) {
          const mappedClubs = clubsData.data.map(club => ({
            id: club.id,
            name: club.name,
            description: club.description,
            created_at: club.created_at,
          }));
          setClubs(mappedClubs);
        }

        if (eventsData.data) {
          const mappedEvents = eventsData.data.map(event => ({
            id: event.id,
            name: event.name,
            organizing_club_id: event.organizing_club_id,
            venue: event.venue,
            date: event.date,
            time: event.time,
            created_by: event.created_by,
            created_at: event.created_at,
          }));
          setEvents(mappedEvents);
        }

        if (eventRegsData.data) {
          const mappedEventRegs = eventRegsData.data.map(reg => ({
            id: reg.id,
            user_id: reg.user_id,
            event_id: reg.event_id,
            registered_at: reg.registered_at,
            user: reg.users ? {
              id: reg.user_id,
              name: reg.users.name,
              email: reg.users.email,
              studentId: reg.users.student_id,
              role: 'student' as const,
              created_at: new Date().toISOString(),
            } : undefined,
          }));
          setEventRegistrations(mappedEventRegs);
        }

        if (clubRegsData.data) {
          const mappedClubRegs = clubRegsData.data.map(reg => ({
            id: reg.id,
            user_id: reg.user_id,
            club_id: reg.club_id,
            status: reg.status as 'pending' | 'approved' | 'rejected',
            requested_at: reg.requested_at,
            approved_at: reg.approved_at,
            user: reg.users ? {
              id: reg.user_id,
              name: reg.users.name,
              email: reg.users.email,
              studentId: reg.users.student_id,
              role: 'student' as const,
              created_at: new Date().toISOString(),
            } : undefined,
          }));
          setClubRegistrations(mappedClubRegs);
        }
      } else {
        // Use fallback data
        setClubs(fallbackData.clubs);
        setEvents(fallbackData.events);
        setEventRegistrations(fallbackData.eventRegistrations);
        setClubRegistrations(fallbackData.clubRegistrations);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      // Use fallback data on error
      setClubs(fallbackData.clubs);
      setEvents(fallbackData.events);
      setEventRegistrations(fallbackData.eventRegistrations);
      setClubRegistrations(fallbackData.clubRegistrations);
    } finally {
      setLoading(false);
    }
  };

  // Initialize data on mount
  useEffect(() => {
    refreshData();
  }, []);

  const createEvent = async (eventData: Omit<Event, 'id' | 'created_at'>) => {
    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase
          .from('events')
          .insert({
            name: eventData.name,
            organizing_club_id: eventData.organizing_club_id,
            venue: eventData.venue,
            date: eventData.date,
            time: eventData.time,
            created_by: eventData.created_by,
          })
          .select()
          .single();

        if (error) throw error;

        if (data) {
          const newEvent: Event = {
            id: data.id,
            name: data.name,
            organizing_club_id: data.organizing_club_id,
            venue: data.venue,
            date: data.date,
            time: data.time,
            created_by: data.created_by,
            created_at: data.created_at,
          };
          setEvents(prev => [...prev, newEvent]);
        }
      } else {
        // Fallback mode
        const newEvent: Event = {
          ...eventData,
          id: Date.now().toString(),
          created_at: new Date().toISOString(),
        };
        setEvents(prev => [...prev, newEvent]);
      }
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  };

  const registerForEvent = async (userId: string, eventId: string) => {
    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase
          .from('event_registrations')
          .insert({
            user_id: userId,
            event_id: eventId,
          })
          .select()
          .single();

        if (error) throw error;

        if (data) {
          const newRegistration: EventRegistration = {
            id: data.id,
            user_id: data.user_id,
            event_id: data.event_id,
            registered_at: data.registered_at,
          };
          setEventRegistrations(prev => [...prev, newRegistration]);
        }
      } else {
        // Fallback mode
        const registration: EventRegistration = {
          id: Date.now().toString(),
          user_id: userId,
          event_id: eventId,
          registered_at: new Date().toISOString(),
        };
        setEventRegistrations(prev => [...prev, registration]);
      }
    } catch (error) {
      console.error('Error registering for event:', error);
      throw error;
    }
  };

  const registerForClub = async (userId: string, clubId: string) => {
    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase
          .from('club_registrations')
          .insert({
            user_id: userId,
            club_id: clubId,
            status: 'pending',
          })
          .select()
          .single();

        if (error) throw error;

        if (data) {
          const newRegistration: ClubRegistration = {
            id: data.id,
            user_id: data.user_id,
            club_id: data.club_id,
            status: data.status as 'pending' | 'approved' | 'rejected',
            requested_at: data.requested_at,
            approved_at: data.approved_at,
          };
          setClubRegistrations(prev => [...prev, newRegistration]);
        }
      } else {
        // Fallback mode
        const registration: ClubRegistration = {
          id: Date.now().toString(),
          user_id: userId,
          club_id: clubId,
          status: 'pending',
          requested_at: new Date().toISOString(),
        };
        setClubRegistrations(prev => [...prev, registration]);
      }
    } catch (error) {
      console.error('Error registering for club:', error);
      throw error;
    }
  };

  const approveClubRegistration = async (registrationId: string) => {
    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase
          .from('club_registrations')
          .update({
            status: 'approved',
            approved_at: new Date().toISOString(),
          })
          .eq('id', registrationId);

        if (error) throw error;

        setClubRegistrations(prev =>
          prev.map(reg =>
            reg.id === registrationId
              ? { ...reg, status: 'approved' as const, approved_at: new Date().toISOString() }
              : reg
          )
        );
      } else {
        // Fallback mode
        setClubRegistrations(prev =>
          prev.map(reg =>
            reg.id === registrationId
              ? { ...reg, status: 'approved' as const, approved_at: new Date().toISOString() }
              : reg
          )
        );
      }
    } catch (error) {
      console.error('Error approving club registration:', error);
      throw error;
    }
  };

  const rejectClubRegistration = async (registrationId: string) => {
    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase
          .from('club_registrations')
          .update({
            status: 'rejected',
          })
          .eq('id', registrationId);

        if (error) throw error;

        setClubRegistrations(prev =>
          prev.map(reg =>
            reg.id === registrationId ? { ...reg, status: 'rejected' as const } : reg
          )
        );
      } else {
        // Fallback mode
        setClubRegistrations(prev =>
          prev.map(reg =>
            reg.id === registrationId ? { ...reg, status: 'rejected' as const } : reg
          )
        );
      }
    } catch (error) {
      console.error('Error rejecting club registration:', error);
      throw error;
    }
  };

  const value = {
    clubs,
    events,
    eventRegistrations,
    clubRegistrations,
    loading,
    createEvent,
    registerForEvent,
    registerForClub,
    approveClubRegistration,
    rejectClubRegistration,
    refreshData,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};