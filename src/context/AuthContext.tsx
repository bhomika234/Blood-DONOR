import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { db } from '../lib/db';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signup: (email: string, displayName: string, role?: 'user' | 'admin') => Promise<User>;
  login: (email: string) => Promise<User>;
  loginWithGoogle: () => Promise<User>;
  logout: () => Promise<void>;
  updateProfile: (displayName: string, photoURL?: string) => Promise<User>;
  toasts: Toast[];
  addToast: (message: string, type: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Toast helper
  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Auto remove toast
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    // Load logged-in user session on mount
    const savedUser = localStorage.getItem('blood_finder_curr_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Simulate Signup
  const signup = async (email: string, displayName: string, role: 'user' | 'admin' = 'user'): Promise<User> => {
    setLoading(true);
    try {
      // Simulate network request
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      const emailLower = email.toLowerCase().trim();
      const users = db.getUsers();
      
      // Check if user exists
      const existingUser = users.find(u => u.email.toLowerCase() === emailLower);
      if (existingUser) {
        throw new Error('An account with this email already exists.');
      }

      // Determine starting role
      // If email is admin@blooddonor.org, automatically make them admin
      const finalRole = emailLower === 'admin@blooddonor.org' ? 'admin' : role;

      const newUser: User = {
        uid: `user-${Date.now()}`,
        email: emailLower,
        displayName,
        role: finalRole,
        createdAt: new Date().toISOString()
      };

      db.addUser(newUser);
      localStorage.setItem('blood_finder_curr_user', JSON.stringify(newUser));
      setCurrentUser(newUser);
      addToast(`Welcome, ${displayName}! Account created successfully.`, 'success');
      return newUser;
    } catch (err: any) {
      addToast(err.message || 'Signup failed', 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Simulate Login
  const login = async (email: string): Promise<User> => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      const emailLower = email.toLowerCase().trim();
      const users = db.getUsers();
      
      // Check if user exists
      let user = users.find(u => u.email.toLowerCase() === emailLower);
      
      if (!user) {
        // Since we are simulating, let's automatically sign them up if they log in
        // or check database. For high usability, if they submit a known admin or custom test user, let's resolve it.
        // If they enter a new email, we can register them, or restrict to already signed up users.
        // Let's allow registration easily OR throw user not found if we want strict login.
        // To prevent friction of "forgot password" or "signup first" for testers, let's create user if not exists
        // but if they submit standard test creds, log them in.
        const defaultName = emailLower.split('@')[0];
        const isDefaultAdmin = emailLower === 'admin@blooddonor.org';
        const role: 'user' | 'admin' = isDefaultAdmin ? 'admin' : 'user';

        user = {
          uid: isDefaultAdmin ? 'admin-uid-123' : `user-${Date.now()}`,
          email: emailLower,
          displayName: isDefaultAdmin ? 'System Administrator' : defaultName.charAt(0).toUpperCase() + defaultName.slice(1),
          role,
          createdAt: new Date().toISOString()
        };
        db.addUser(user);
      }

      localStorage.setItem('blood_finder_curr_user', JSON.stringify(user));
      setCurrentUser(user);
      addToast(`Logged in successfully as ${user.displayName}!`, 'success');
      return user;
    } catch (err: any) {
      addToast(err.message || 'Login failed', 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Simulate Google Auth
  const loginWithGoogle = async (): Promise<User> => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Simulate structured Google Account payload
      const mockGoogleEmails = ['john.developer@gmail.com', 'lisa.care@gmail.com', 'robert.smith@gmail.com'];
      const mockGoogleNames = ['John Developer', 'Lisa Care', 'Robert Smith'];
      const randomIndex = Math.floor(Math.random() * mockGoogleEmails.length);
      
      const email = mockGoogleEmails[randomIndex];
      const displayName = mockGoogleNames[randomIndex];
      
      const users = db.getUsers();
      let user = users.find(u => u.email === email);
      
      if (!user) {
        user = {
          uid: `g-user-${Date.now()}`,
          email,
          displayName,
          photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${displayName}`,
          role: 'user',
          createdAt: new Date().toISOString()
        };
        db.addUser(user);
      }

      localStorage.setItem('blood_finder_curr_user', JSON.stringify(user));
      setCurrentUser(user);
      addToast(`Logged in via Google as ${user.displayName}!`, 'success');
      return user;
    } catch (err: any) {
      addToast(err.message || 'Google Sign-In failed', 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Simulate Logout
  const logout = async (): Promise<void> => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      localStorage.removeItem('blood_finder_curr_user');
      setCurrentUser(null);
      addToast('Logged out successfully.', 'info');
    } catch (err: any) {
      addToast('Logout failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Update profile variables
  const updateProfile = async (displayName: string, photoURL?: string): Promise<User> => {
    if (!currentUser) throw new Error('Not logged in');
    
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      
      const updatedUser: User = {
        ...currentUser,
        displayName,
        photoURL: photoURL || currentUser.photoURL
      };

      // Update in users collection
      const users = db.getUsers();
      const updatedUsers = users.map(u => u.uid === currentUser.uid ? updatedUser : u);
      db.saveUsers(updatedUsers);

      localStorage.setItem('blood_finder_curr_user', JSON.stringify(updatedUser));
      setCurrentUser(updatedUser);
      addToast('Profile updated successfully!', 'success');
      return updatedUser;
    } catch (err: any) {
      addToast('Failed to update profile', 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        signup,
        login,
        loginWithGoogle,
        logout,
        updateProfile,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
