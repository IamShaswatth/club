import React, { useState } from 'react';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';

export const AuthWrapper: React.FC = () => {
  const [showSignup, setShowSignup] = useState(false);

  if (showSignup) {
    return <SignupForm onBackToLogin={() => setShowSignup(false)} />;
  }

  return <LoginForm onShowSignup={() => setShowSignup(true)} />;
};