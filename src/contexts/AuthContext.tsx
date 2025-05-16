
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock authentication data for demo purposes
const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'John Driver',
    email: 'driver@buswatch.com',
    role: 'driver',
    schoolId: '1',
    createdAt: new Date()
  },
  {
    id: '2',
    name: 'Sarah Admin',
    email: 'schooladmin@buswatch.com',
    role: 'school-admin',
    schoolId: '1',
    createdAt: new Date()
  },
  {
    id: '3',
    name: 'Mike Super',
    email: 'superadmin@buswatch.com',
    role: 'super-admin',
    createdAt: new Date()
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for saved authentication in localStorage
    const savedUser = localStorage.getItem('buswatch_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Failed to parse user from localStorage', e);
        localStorage.removeItem('buswatch_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Find user by email (mock authentication)
    const foundUser = MOCK_USERS.find(u => u.email === email);
    
    if (!foundUser) {
      setLoading(false);
      throw new Error('Invalid email or password');
    }
    
    // In a real app, you'd verify the password here
    
    // Save user to state and localStorage
    setUser(foundUser);
    localStorage.setItem('buswatch_user', JSON.stringify(foundUser));
    
    setLoading(false);
  };
  
  const logout = async (): Promise<void> => {
    // Clear user data
    setUser(null);
    localStorage.removeItem('buswatch_user');
  };
  
  const hasRole = (roles: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    
    if (Array.isArray(roles)) {
      return roles.includes(user.role);
    }
    
    return user.role === roles;
  };
  
  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    hasRole,
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
