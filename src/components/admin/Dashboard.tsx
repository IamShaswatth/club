import React from 'react';
import { useData } from '../../contexts/DataContext';
import { Calendar, Users, Bell, TrendingUp } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { events, eventRegistrations, clubRegistrations } = useData();

  const pendingClubRegistrations = clubRegistrations.filter(reg => reg.status === 'pending');
  const totalEventRegistrations = eventRegistrations.length;

  const stats = [
    {
      title: 'Total Events',
      value: events.length,
      icon: Calendar,
      color: 'from-blue-600 to-blue-700',
    },
    {
      title: 'Event Registrations',
      value: totalEventRegistrations,
      icon: Users,
      color: 'from-green-600 to-green-700',
    },
    {
      title: 'Pending Approvals',
      value: pendingClubRegistrations.length,
      icon: Bell,
      color: 'from-yellow-600 to-yellow-700',
    },
    {
      title: 'Active Clubs',
      value: 5,
      icon: TrendingUp,
      color: 'from-purple-600 to-purple-700',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Overview of club management system</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Events */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Events</h2>
        <div className="space-y-4">
          {events.slice(0, 3).map((event) => (
            <div key={event.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">{event.name}</h3>
                <p className="text-sm text-gray-600">{event.venue} • {event.date} at {event.time}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-blue-600">
                  {eventRegistrations.filter(reg => reg.event_id === event.id).length} registrations
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pending Club Registrations */}
      {pendingClubRegistrations.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Pending Club Registrations</h2>
          <div className="space-y-3">
            {pendingClubRegistrations.slice(0, 5).map((registration) => (
              <div key={registration.id} className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Student ID: {registration.user_id}</p>
                  <p className="text-sm text-gray-600">Club ID: {registration.club_id}</p>
                </div>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors">
                    Approve
                  </button>
                  <button className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors">
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};