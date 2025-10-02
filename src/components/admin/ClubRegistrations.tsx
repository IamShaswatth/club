import React from 'react';
import { useData } from '../../contexts/DataContext';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

export const ClubRegistrations: React.FC = () => {
  const { clubs, clubRegistrations, approveClubRegistration, rejectClubRegistration } = useData();

  const pendingRegistrations = clubRegistrations.filter(reg => reg.status === 'pending');
  const approvedRegistrations = clubRegistrations.filter(reg => reg.status === 'approved');
  const rejectedRegistrations = clubRegistrations.filter(reg => reg.status === 'rejected');

  const getClubName = (clubId: string) => {
    return clubs.find(club => club.id === clubId)?.name || 'Unknown Club';
  };

  const RegistrationCard: React.FC<{ 
    registration: any; 
    showActions?: boolean;
  }> = ({ registration, showActions = false }) => (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-gray-900">Student ID: {registration.user_id}</h3>
          <p className="text-sm text-gray-600">Club: {getClubName(registration.club_id)}</p>
          <p className="text-xs text-gray-500">
            Requested: {new Date(registration.requested_at).toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {registration.status === 'pending' && (
            <span className="flex items-center space-x-1 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
              <Clock className="w-3 h-3" />
              <span>Pending</span>
            </span>
          )}
          {registration.status === 'approved' && (
            <span className="flex items-center space-x-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
              <CheckCircle className="w-3 h-3" />
              <span>Approved</span>
            </span>
          )}
          {registration.status === 'rejected' && (
            <span className="flex items-center space-x-1 px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
              <XCircle className="w-3 h-3" />
              <span>Rejected</span>
            </span>
          )}
        </div>
      </div>
      {showActions && (
        <div className="mt-4 flex space-x-2">
          <button
            onClick={async () => {
              try {
                await approveClubRegistration(registration.id);
              } catch (error) {
                console.error('Error approving registration:', error);
                alert('Error approving registration. Please try again.');
              }
            }}
            className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Approve</span>
          </button>
          <button
            onClick={async () => {
              try {
                await rejectClubRegistration(registration.id);
              } catch (error) {
                console.error('Error rejecting registration:', error);
                alert('Error rejecting registration. Please try again.');
              }
            }}
            className="flex items-center space-x-1 px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
          >
            <XCircle className="w-4 h-4" />
            <span>Reject</span>
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Club Registrations</h1>
        <p className="text-gray-600 mt-2">Manage student club membership requests</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{pendingRegistrations.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-gray-900">{approvedRegistrations.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-gray-900">{rejectedRegistrations.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Registrations */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <Clock className="w-5 h-5 text-yellow-600" />
          <span>Pending Registrations</span>
        </h2>
        <div className="space-y-4">
          {pendingRegistrations.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No pending registrations</p>
          ) : (
            pendingRegistrations.map((registration) => (
              <RegistrationCard key={registration.id} registration={registration} showActions={true} />
            ))
          )}
        </div>
      </div>

      {/* Approved Registrations */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span>Approved Registrations</span>
        </h2>
        <div className="space-y-4">
          {approvedRegistrations.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No approved registrations</p>
          ) : (
            approvedRegistrations.map((registration) => (
              <RegistrationCard key={registration.id} registration={registration} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};