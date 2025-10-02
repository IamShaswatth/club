import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { LoginForm } from './components/LoginForm';
import { Layout } from './components/Layout';
import { AdminDashboard } from './components/admin/Dashboard';
import { EventManagement } from './components/admin/EventManagement';
import { ClubRegistrations } from './components/admin/ClubRegistrations';
import { StudentDashboard } from './components/student/Dashboard';
import { Clubs } from './components/student/Clubs';
import { Notifications } from './components/Notifications';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-white font-bold text-xl">CM</span>
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  const renderPage = () => {
    if (user.role === 'admin') {
      switch (currentPage) {
        case 'dashboard':
          return <AdminDashboard />;
        case 'events':
          return <EventManagement />;
        case 'registrations':
          return <ClubRegistrations />;
        case 'notifications':
          return <Notifications />;
        default:
          return <AdminDashboard />;
      }
    } else {
      switch (currentPage) {
        case 'dashboard':
          return <StudentDashboard />;
        case 'clubs':
          return <Clubs />;
        case 'notifications':
          return <Notifications />;
        default:
          return <StudentDashboard />;
      }
    }
  };

  return (
    <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
};

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  );
}

export default App;