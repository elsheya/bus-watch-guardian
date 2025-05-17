
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { supabase } from '../integrations/supabase/client';
import { Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo users to use when Supabase auth fails
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
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up the auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log('Auth state changed:', event);
        setSession(currentSession);
        
        if (currentSession?.user) {
          // Fetch the user's profile from Supabase
          setTimeout(() => {
            fetchUserProfile(currentSession.user.id);
          }, 0);
        } else {
          setUser(null);
        }
      }
    );

    // Then check for an existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      
      if (currentSession?.user) {
        fetchUserProfile(currentSession.user.id);
      } else {
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
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        const userProfile: User = {
          id: data.id,
          name: data.name,
          email: data.email,
          role: data.role as UserRole,
          schoolId: data.school_id,
          createdAt: new Date(data.created_at)
        };
        
        setUser(userProfile);
        localStorage.setItem('buswatch_user', JSON.stringify(userProfile));
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const login = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    
    try {
      // Try to log in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        throw error;
      }
      
      // If successful, the onAuthStateChange listener will handle setting the user
    } catch (error) {
      console.error('Supabase login error:', error);
      
      // Fall back to mock login for demo purposes
      const foundUser = MOCK_USERS.find(u => u.email === email);
      
      if (!foundUser) {
        setLoading(false);
        throw new Error('Invalid email or password');
      }
      
      // Save user to state and localStorage
      setUser(foundUser);
      localStorage.setItem('buswatch_user', JSON.stringify(foundUser));
      
      setLoading(false);
    }
  };
  
  const logout = async (): Promise<void> => {
    try {
      // Try to sign out with Supabase
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error signing out with Supabase:', error);
    }
    
    // Clear user data regardless of Supabase response
    setUser(null);
    setSession(null);
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
    session,
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
