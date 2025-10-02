import React from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { Bell, CheckCircle, XCircle, Clock, Calendar } from 'lucide-react';

export const Notifications: React.FC = () => {
  const { clubs, events, clubRegistrations, eventRegistrations } = useData();
  const { user } = useAuth();

  const getNotifications = () => {
    if (!user) return [];

    const notifications: any[] = [];

    if (user.role === 'admin') {
      // Admin notifications
      const pendingClubRegistrations = clubRegistrations.filter(reg => reg.status === 'pending');
      pendingClubRegistrations.forEach(reg => {
        const club = clubs.find(c => c.id === reg.club_id);
        notifications.push({
          id: `club-${reg.id}`,
          type: 'club_registration',
          title: 'New Club Registration',
          message: `Student ${reg.user_id} wants to join ${club?.name || 'Unknown Club'}`,
          timestamp: reg.requested_at,
          icon: Bell,
          color: 'yellow',
        });
      });

      // Recent event registrations
      eventRegistrations.forEach(reg => {
        const event = events.find(e => e.id === reg.event_id);
        notifications.push({
          id: `event-${reg.id}`,
          type: 'event_registration',
          title: 'New Event Registration',
          message: `Student ${reg.user_id} registered for ${event?.name || 'Unknown Event'}`,
          timestamp: reg.registered_at,
          icon: Calendar,
          color: 'blue',
        });
      });
    } else {
      // Student notifications
      const userClubRegistrations = clubRegistrations.filter(reg => reg.user_id === user.id);
      userClubRegistrations.forEach(reg => {
        const club = clubs.find(c => c.id === reg.club_id);
        let message = '';
        let icon = Clock;
        let color = 'yellow';

        if (reg.status === 'approved') {
          message = `Your registration for ${club?.name || 'Unknown Club'} has been approved!`;
          icon = CheckCircle;
          color = 'green';
        } else if (reg.status === 'rejected') {
          message = `Your registration for ${club?.name || 'Unknown Club'} was rejected.`;
          icon = XCircle;
          color = 'red';
        } else {
          message = `Your registration for ${club?.name || 'Unknown Club'} is pending approval.`;
        }

        notifications.push({
          id: `user-club-${reg.id}`,
          type: 'club_status',
          title: 'Club Registration Update',
          message,
          timestamp: reg.approved_at || reg.requested_at,
          icon,
          color,
        });
      });

      // Upcoming events
      const upcomingEvents = events.filter(event => {
        const eventDate = new Date(event.date);
        const now = new Date();
        const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
        return eventDate >= now && eventDate <= threeDaysFromNow;
      });

      upcomingEvents.forEach(event => {
        const club = clubs.find(c => c.id === event.organizing_club_id);
        notifications.push({
          id: `upcoming-${event.id}`,
          type: 'upcoming_event',
          title: 'Upcoming Event',
          message: `${event.name} by ${club?.name || 'Unknown Club'} is happening soon!`,
          timestamp: event.created_at,
          icon: Calendar,
          color: 'blue',
        });
      });
    }

    return notifications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  };

  const notifications = getNotifications();

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'yellow':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'green':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'red':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'blue':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
        <p className="text-gray-600 mt-2">Stay updated with the latest activities and updates</p>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Bell className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">
            All Notifications ({notifications.length})
          </h2>
        </div>

        <div className="space-y-4">
          {notifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No notifications yet</p>
              <p className="text-sm text-gray-400">
                {user?.role === 'admin' 
                  ? 'New registrations and activities will appear here'
                  : 'Updates about your registrations and new events will appear here'
                }
              </p>
            </div>
          ) : (
            notifications.map((notification) => {
              const Icon = notification.icon;
              return (
                <div
                  key={notification.id}
                  className={`border rounded-lg p-4 ${getColorClasses(notification.color)} hover:shadow-md transition-shadow`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium">{notification.title}</h3>
                      <p className="text-sm mt-1">{notification.message}</p>
                      <p className="text-xs mt-2 opacity-75">
                        {new Date(notification.timestamp).toLocaleDateString()} at{' '}
                        {new Date(notification.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Notification Preferences</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Event Notifications</h3>
              <p className="text-sm text-gray-600">Get notified about new events and updates</p>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Registration Updates</h3>
              <p className="text-sm text-gray-600">Get notified about registration status changes</p>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Club Updates</h3>
              <p className="text-sm text-gray-600">Get notified about club activities and announcements</p>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
        </div>
      </div>
    </div>
  );
};