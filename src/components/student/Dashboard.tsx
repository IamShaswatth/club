import React from 'react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { Calendar, MapPin, Clock, Users, UserPlus } from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { clubs, events, eventRegistrations, registerForEvent } = useData();
  const { user } = useAuth();

  const upcomingEvents = events.filter(event => new Date(event.date) >= new Date());
  const userRegistrations = eventRegistrations.filter(reg => reg.user_id === user?.id);

  const isRegisteredForEvent = (eventId: string) => {
    return userRegistrations.some(reg => reg.event_id === eventId);
  };

  const handleEventRegistration = (eventId: string) => {
    if (user && !isRegisteredForEvent(eventId)) {
      registerForEvent(user.id, eventId);
    }
  };

  const getClubName = (clubId: string) => {
    return clubs.find(club => club.id === clubId)?.name || 'Unknown Club';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.name}!</h1>
        <p className="text-gray-600 mt-2">Discover and join exciting events and clubs</p>
      </div>

      {/* Current Events */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          <span>Current Events</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {upcomingEvents.map((event) => {
            const registered = isRegisteredForEvent(event.id);
            return (
              <div key={event.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all">
                <div className="mb-3">
                  <h3 className="font-semibold text-gray-900">{event.name}</h3>
                  <p className="text-sm text-blue-600">{getClubName(event.organizing_club_id)}</p>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{event.venue}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{event.time}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleEventRegistration(event.id)}
                  disabled={registered}
                  className={`w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    registered
                      ? 'bg-green-100 text-green-800 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  <UserPlus className="w-4 h-4" />
                  <span>{registered ? 'Registered' : 'Register'}</span>
                </button>
              </div>
            );
          })}
        </div>
        {upcomingEvents.length === 0 && (
          <p className="text-gray-500 text-center py-8">No upcoming events at the moment</p>
        )}
      </div>

      {/* Quick Club Access */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <Users className="w-5 h-5 text-purple-600" />
          <span>Available Clubs</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clubs.slice(0, 3).map((club) => (
            <div key={club.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all">
              <h3 className="font-semibold text-gray-900 mb-2">{club.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{club.description}</p>
              <button className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* My Registrations */}
      {userRegistrations.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">My Event Registrations</h2>
          <div className="space-y-3">
            {userRegistrations.map((registration) => {
              const event = events.find(e => e.id === registration.event_id);
              if (!event) return null;
              
              return (
                <div key={registration.id} className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">{event.name}</h3>
                    <p className="text-sm text-gray-600">
                      {event.venue} • {new Date(event.date).toLocaleDateString()} at {event.time}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                    Registered
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};