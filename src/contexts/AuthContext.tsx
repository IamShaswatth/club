import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { hashPassword, verifyPassword, generateStudentId } from '../lib/auth';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Helper functions for user database simulation
// Fallback localStorage functions
const getStoredUsers = (): User[] => {
  const storedUsers = localStorage.getItem('registeredUsers');
  if (storedUsers) {
    return JSON.parse(storedUsers);
  }
  // Default users for fallback mode
  const defaultUsers: User[] = [
    {
      id: '1',
      email: 'admin@college.edu',
      name: 'Admin User',
      role: 'admin',
      created_at: new Date().toISOString(),
    },
    {
      id: '2',
      email: 'john.doe@student.edu',
      name: 'John Doe',
      studentId: 'STU001',
      role: 'student',
      created_at: new Date().toISOString(),
    },
  ];
  localStorage.setItem('registeredUsers', JSON.stringify(defaultUsers));
  return defaultUsers;
};

const saveUserToStorage = (newUser: User) => {
  const users = getStoredUsers();
  users.push(newUser);
  localStorage.setItem('registeredUsers', JSON.stringify(users));
};

// Helper function to initialize default users in Supabase (run once)
const initializeDefaultUsers = async () => {
  if (!isSupabaseConfigured || !supabase) return;
  
  try {
    // Check if admin user exists
    const { data: adminExists } = await supabase
      .from('users')
      .select('id')
      .eq('email', 'admin@college.edu')
      .single();

    if (!adminExists) {
      // Create default admin user
      const adminPasswordHash = await hashPassword('password123');
      await supabase
        .from('users')
        .insert({
          email: 'admin@college.edu',
          name: 'Admin User',
          password_hash: adminPasswordHash,
          role: 'admin',
        });
    }
  } catch (error) {
    console.log('Default users initialization:', error);
  }
};



export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      // Initialize default users
      await initializeDefaultUsers();
      
      // Check for stored user session
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setLoading(false);
    };

    initializeApp();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      if (isSupabaseConfigured && supabase) {
        // Database mode
        const { data: dbUser, error } = await supabase
          .from('users')
          .select('*')
          .eq('email', email)
          .single();

        if (error || !dbUser) {
          throw new Error('Invalid email or password');
        }

        // Verify password
        const passwordMatch = await verifyPassword(password, dbUser.password_hash);
        if (!passwordMatch) {
          throw new Error('Invalid email or password');
        }

        // Transform database user to app user format
        const user: User = {
          id: dbUser.id,
          name: dbUser.name,
          email: dbUser.email,
          studentId: dbUser.student_id,
          role: dbUser.role,
          created_at: dbUser.created_at,
        };

        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        // Fallback mode - use localStorage
        const users = getStoredUsers();
        const foundUser = users.find(u => u.email === email);
        
        if (!foundUser || password !== 'password123') {
          throw new Error('Invalid email or password');
        }

        setUser(foundUser);
        localStorage.setItem('user', JSON.stringify(foundUser));
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      if (isSupabaseConfigured && supabase) {
        // Database mode
        const { data: existingUser } = await supabase
          .from('users')
          .select('email')
          .eq('email', email)
          .single();

        if (existingUser) {
          throw new Error('User with this email already exists');
        }

        // Hash the password
        const passwordHash = await hashPassword(password);
        
        // Create new user in database
        const { data: newUser, error } = await supabase
          .from('users')
          .insert({
            name,
            email,
            password_hash: passwordHash,
            student_id: generateStudentId(),
            role: 'student',
          })
          .select()
          .single();

        if (error) {
          throw new Error(error.message);
        }

        // Transform database user to app user format
        const user: User = {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          studentId: newUser.student_id,
          role: newUser.role,
          created_at: newUser.created_at,
        };

        // Automatically log in the new user
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        // Fallback mode - use localStorage
        const users = getStoredUsers();
        
        // Check if user already exists
        if (users.find(u => u.email === email)) {
          throw new Error('User with this email already exists');
        }

        // Create new user
        const newUser: User = {
          id: Date.now().toString(),
          name,
          email,
          studentId: generateStudentId(),
          role: 'student',
          created_at: new Date().toISOString(),
        };

        saveUserToStorage(newUser);
        
        // Automatically log in the new user
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
      }
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    user,
    login,
    signup,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};