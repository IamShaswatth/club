import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { Users, UserPlus, CheckCircle, Clock } from 'lucide-react';

export const Clubs: React.FC = () => {
  const { clubs, clubRegistrations, registerForClub } = useData();
  const { user } = useAuth();
  const [registering, setRegistering] = useState<string | null>(null);

  const getUserClubStatus = (clubId: string) => {
    if (!user) return null;
    return clubRegistrations.find(reg => reg.user_id === user.id && reg.club_id === clubId);
  };

  const handleClubRegistration = async (clubId: string) => {
    if (!user) return;
    
    setRegistering(clubId);
    try {
      await registerForClub(user.id, clubId);
    } catch (error) {
      console.error('Error registering for club:', error);
      alert('Error registering for club. Please try again.');
    } finally {
      setRegistering(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Available Clubs</h1>
        <p className="text-gray-600 mt-2">Join clubs that match your interests and talents</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clubs.map((club) => {
          const registration = getUserClubStatus(club.id);
          const isRegistering = registering === club.id;
          
          return (
            <div key={club.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden">
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{club.name}</h3>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-6">{club.description}</p>
                
                <div className="flex items-center justify-between">
                  {!registration ? (
                    <button
                      onClick={() => handleClubRegistration(club.id)}
                      disabled={isRegistering}
                      className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors disabled:opacity-50"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>{isRegistering ? 'Registering...' : 'Register'}</span>
                    </button>
                  ) : (
                    <div className="flex items-center space-x-2">
                      {registration.status === 'pending' && (
                        <span className="flex items-center space-x-1 px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
                          <Clock className="w-4 h-4" />
                          <span>Pending Approval</span>
                        </span>
                      )}
                      {registration.status === 'approved' && (
                        <span className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                          <CheckCircle className="w-4 h-4" />
                          <span>Member</span>
                        </span>
                      )}
                      {registration.status === 'rejected' && (
                        <button
                          onClick={() => handleClubRegistration(club.id)}
                          disabled={isRegistering}
                          className="flex items-center space-x-2 bg-red-100 text-red-800 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors"
                        >
                          <UserPlus className="w-4 h-4" />
                          <span>Apply Again</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Club ID: {club.id}</span>
                    <span>Est. {new Date(club.created_at).getFullYear()}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Club Registration Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">How Club Registration Works</h3>
        <div className="space-y-2 text-sm text-blue-800">
          <p>• Click "Register" to submit your club membership request</p>
          <p>• Admin will review your application</p>
          <p>• You'll receive a notification once your application is processed</p>
          <p>• Approved members can participate in club activities and events</p>
        </div>
      </div>
    </div>
  );
};