'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import type { User } from '@supabase/supabase-js';

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  mobile: string | null;
}

interface UserAuthContextType {
  isAuthenticated: boolean;
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, fullName: string, mobile: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const UserAuthContext = createContext<UserAuthContextType | undefined>(undefined);

export function UserAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        console.log('User auth state changed:', _event);
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await fetchProfile(session.user.id);
      }
    } catch (error) {
      console.error('Error checking user:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, full_name, email, mobile')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      console.log('Fetched profile:', data);
      setUser(data);
    } catch (error) {
      console.error('Error in fetchProfile:', error);
    }
  };

  const register = async (
    email: string,
    password: string,
    fullName: string,
    mobile: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log('Starting registration for:', email);

      // Step 1: Sign up with Supabase Auth
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            mobile: mobile,
          },
        },
      });

      if (signUpError) {
        console.error('Signup error:', signUpError);
        return { success: false, error: signUpError.message };
      }

      if (!authData.user) {
        return { success: false, error: 'User creation failed' };
      }

      console.log('Auth user created:', authData.user.id);

      // Step 2: Wait a bit for the trigger to create the profile
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Step 3: Update the profile with mobile number
      console.log('Updating profile with mobile number...');
      
      const { data: updateData, error: updateError } = await supabase
        .from('users')
        .update({
          mobile: mobile,
          full_name: fullName,
        })
        .eq('id', authData.user.id)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating profile:', updateError);
        // Don't fail registration if update fails
      } else {
        console.log('Profile updated successfully:', updateData);
      }

      // Step 4: Verify the update worked
      const { data: verifyData } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      console.log('Verified profile data:', verifyData);

      return { success: true };
    } catch (error: any) {
      console.error('Registration exception:', error);
      return { success: false, error: error.message || 'An error occurred during registration' };
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('Logging in:', email);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        return false;
      }

      console.log('Login successful');
      
      // Fetch the profile to update state
      if (data.user) {
        await fetchProfile(data.user.id);
      }

      return true;
    } catch (error) {
      console.error('Login exception:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      console.log('Logging out...');
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <UserAuthContext.Provider value={{ 
      isAuthenticated: !!user, 
      user, 
      loading, 
      login, 
      register, 
      logout 
    }}>
      {children}
    </UserAuthContext.Provider>
  );
}

export function useUserAuth() {
  const context = useContext(UserAuthContext);
  if (!context) {
    throw new Error('useUserAuth must be used within UserAuthProvider');
  }
  return context;
}
