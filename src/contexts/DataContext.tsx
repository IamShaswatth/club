import React, { createContext, useContext, useState } from 'react';
import { Club, Event, EventRegistration, ClubRegistration } from '../types';

interface DataContextType {
  clubs: Club[];
  events: Event[];
  eventRegistrations: EventRegistration[];
  clubRegistrations: ClubRegistration[];
  createEvent: (event: Omit<Event, 'id' | 'created_at'>) => void;
  registerForEvent: (userId: string, eventId: string) => void;
  registerForClub: (userId: string, clubId: string) => void;
  approveClubRegistration: (registrationId: string) => void;
  rejectClubRegistration: (registrationId: string) => void;
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
  const [clubs] = useState<Club[]>([
    { id: '1', name: 'CCC', description: 'Computer Coding Club', created_at: '2024-01-01' },
    { id: '2', name: 'IELTS', description: 'International English Language Testing System', created_at: '2024-01-01' },
    { id: '3', name: 'EPRC', description: 'English Proficiency Resource Center', created_at: '2024-01-01' },
    { id: '4', name: 'IEF', description: 'Innovation and Entrepreneurship Forum', created_at: '2024-01-01' },
    { id: '5', name: 'Cultural and Music Club', description: 'Cultural activities and music performances', created_at: '2024-01-01' },
  ]);

  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      name: 'Coding Championship',
      organizing_club_id: '1',
      venue: 'Computer Lab A',
      date: '2024-02-15',
      time: '10:00',
      created_by: '1',
      created_at: '2024-01-01',
    },
    {
      id: '2',
      name: 'UI/UX Design Competition',
      organizing_club_id: '1',
      venue: 'Design Studio',
      date: '2024-02-20',
      time: '14:00',
      created_by: '1',
      created_at: '2024-01-01',
    },
  ]);

  const [eventRegistrations, setEventRegistrations] = useState<EventRegistration[]>([]);
  const [clubRegistrations, setClubRegistrations] = useState<ClubRegistration[]>([]);

  const createEvent = (eventData: Omit<Event, 'id' | 'created_at'>) => {
    const newEvent: Event = {
      ...eventData,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
    };
    setEvents(prev => [...prev, newEvent]);
  };

  const registerForEvent = (userId: string, eventId: string) => {
    const registration: EventRegistration = {
      id: Date.now().toString(),
      user_id: userId,
      event_id: eventId,
      registered_at: new Date().toISOString(),
    };
    setEventRegistrations(prev => [...prev, registration]);
  };

  const registerForClub = (userId: string, clubId: string) => {
    const registration: ClubRegistration = {
      id: Date.now().toString(),
      user_id: userId,
      club_id: clubId,
      status: 'pending',
      requested_at: new Date().toISOString(),
    };
    setClubRegistrations(prev => [...prev, registration]);
  };

  const approveClubRegistration = (registrationId: string) => {
    setClubRegistrations(prev =>
      prev.map(reg =>
        reg.id === registrationId
          ? { ...reg, status: 'approved' as const, approved_at: new Date().toISOString() }
          : reg
      )
    );
  };

  const rejectClubRegistration = (registrationId: string) => {
    setClubRegistrations(prev =>
      prev.map(reg =>
        reg.id === registrationId ? { ...reg, status: 'rejected' as const } : reg
      )
    );
  };

  const value = {
    clubs,
    events,
    eventRegistrations,
    clubRegistrations,
    createEvent,
    registerForEvent,
    registerForClub,
    approveClubRegistration,
    rejectClubRegistration,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};