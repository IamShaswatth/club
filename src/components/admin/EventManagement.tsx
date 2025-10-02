import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { Calendar, MapPin, Clock, Plus, Download, Users } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

export const EventManagement: React.FC = () => {
  const { clubs, events, eventRegistrations, createEvent } = useData();
  const { user } = useAuth();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    organizing_club_id: '',
    venue: '',
    date: '',
    time: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      try {
        await createEvent({
          ...formData,
          created_by: user.id,
        });
        setFormData({
          name: '',
          organizing_club_id: '',
          venue: '',
          date: '',
          time: '',
        });
        setShowCreateForm(false);
      } catch (error) {
        console.error('Error creating event:', error);
        alert('Error creating event. Please try again.');
      }
    }
  };

  const downloadCSV = async (eventId: string) => {
    try {
      const registrations = eventRegistrations.filter(reg => reg.event_id === eventId);
      
      if (registrations.length === 0) {
        alert('No registrations found for this event.');
        return;
      }

      let studentsData: Array<{
        studentId: string;
        name: string;
        email: string;
        registrationDate: string;
        registrationTime: string;
      }> = [];

      if (isSupabaseConfigured && supabase) {
        // Fetch real user data from database
        const userIds = registrations.map(reg => reg.user_id);
        const { data: users, error } = await supabase
          .from('users')
          .select('id, name, email, student_id')
          .in('id', userIds);

        if (error) {
          console.error('Error fetching users:', error);
          throw error;
        }

        studentsData = registrations.map(reg => {
          const user = users?.find(u => u.id === reg.user_id);
          const regDate = new Date(reg.registered_at);
          return {
            studentId: user?.student_id || 'N/A',
            name: user?.name || 'Unknown Student',
            email: user?.email || 'Unknown Email',
            registrationDate: regDate.toLocaleDateString(),
            registrationTime: regDate.toLocaleTimeString(),
          };
        });
      } else {
        // Fallback mode - use mock data
        const mockUsers = [
          { id: '2', name: 'John Doe', studentId: 'STU001', email: 'john.doe@student.edu' },
          { id: '3', name: 'Jane Smith', studentId: 'STU002', email: 'jane.smith@student.edu' },
          { id: '4', name: 'Mike Johnson', studentId: 'STU003', email: 'mike.johnson@student.edu' },
          { id: '5', name: 'Sarah Wilson', studentId: 'STU004', email: 'sarah.wilson@student.edu' },
          { id: '6', name: 'Alex Brown', studentId: 'STU005', email: 'alex.brown@student.edu' },
        ];
        
        studentsData = registrations.map(reg => {
          const student = mockUsers.find(u => u.id === reg.user_id);
          const regDate = new Date(reg.registered_at);
          return {
            studentId: student?.studentId || 'Unknown',
            name: student?.name || 'Unknown Student',
            email: student?.email || 'Unknown Email',
            registrationDate: regDate.toLocaleDateString(),
            registrationTime: regDate.toLocaleTimeString(),
          };
        });
      }

      // Create CSV content
      const csvContent = [
        ['Student ID', 'Student Name', 'Email', 'Registration Date', 'Registration Time'],
        ...studentsData.map(student => [
          student.studentId,
          student.name,
          student.email,
          student.registrationDate,
          student.registrationTime
        ])
      ].map(row => row.join(',')).join('\n');

      const event = events.find(e => e.id === eventId);
      const eventName = event?.name || 'Unknown Event';
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${eventName.replace(/[^a-zA-Z0-9]/g, '_')}_registrations.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading CSV:', error);
      alert('Error downloading CSV. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Event Management</h1>
          <p className="text-gray-600 mt-2">Create and manage events</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Create Event</span>
        </button>
      </div>

      {/* Create Event Form */}
      {showCreateForm && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Create New Event</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Event Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Organizing Club</label>
              <select
                value={formData.organizing_club_id}
                onChange={(e) => setFormData({ ...formData, organizing_club_id: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select a club</option>
                {clubs.map((club) => (
                  <option key={club.id} value={club.id}>
                    {club.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Venue</label>
              <input
                type="text"
                value={formData.venue}
                onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div className="md:col-span-2 flex space-x-4">
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Create Event
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Events List */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">All Events</h2>
        <div className="space-y-4">
          {events.map((event) => {
            const club = clubs.find(c => c.id === event.organizing_club_id);
            const registrationCount = eventRegistrations.filter(reg => reg.event_id === event.id).length;
            
            return (
              <div key={event.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{event.name}</h3>
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Users className="w-4 h-4" />
                        <span>Organized by {club?.name || 'Unknown Club'}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{event.venue}</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(event.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span>{event.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{registrationCount}</div>
                      <div className="text-xs text-gray-500">registrations</div>
                    </div>
                    <button
                      onClick={() => downloadCSV(event.id)}
                      className="flex items-center space-x-2 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>CSV</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};