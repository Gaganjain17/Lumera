'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import type { User } from '@supabase/supabase-js';

interface AdminAuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session on mount
    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log('Auth state changed:', _event, session?.user?.email);
      
      if (session?.user) {
        await verifyAdminRole(session.user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      console.log('Checking session:', session?.user?.email, sessionError);
      
      if (session?.user) {
        await verifyAdminRole(session.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error checking user:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const verifyAdminRole = async (authUser: User) => {
    try {
      console.log('Verifying admin role for:', authUser.email, authUser.id);

      // Check if user has admin role in public.users table
      const { data, error } = await supabase
        .from('users')
        .select('id, email, role, full_name')
        .eq('id', authUser.id)
        .single();

      console.log('User data from DB:', data, 'Error:', error);

      if (error) {
        console.error('Error verifying admin role:', error);
        
        // If user doesn't exist in public.users, create them
        if (error.code === 'PGRST116') {
          console.log('User not found in public.users, creating...');
          
          const { data: newUser, error: insertError } = await supabase
            .from('users')
            .insert({
              id: authUser.id,
              email: authUser.email!,
              full_name: authUser.email!.split('@')[0],
              role: 'user', // Default role
            })
            .select()
            .single();

          console.log('Created new user:', newUser, insertError);
          
          if (insertError) {
            console.error('Failed to create user:', insertError);
            setUser(null);
            return;
          }

          // New users are not admin by default
          console.warn('New user created but not admin');
          setUser(null);
          await supabase.auth.signOut();
          return;
        }

        setUser(null);
        return;
      }

      console.log('User role check:', data?.role);

      if (data?.role === 'admin') {
        console.log('Admin verified successfully');
        setUser(authUser);
      } else {
        console.warn('User is not an admin, role:', data?.role);
        setUser(null);
        // Sign out non-admin users
        await supabase.auth.signOut();
      }
    } catch (error) {
      console.error('Error in verifyAdminRole:', error);
      setUser(null);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      console.log('Attempting login for:', email);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log('Login response:', data?.user?.email, 'Error:', error);

      if (error) {
        console.error('Login error:', error.message);
        return false;
      }

      if (!data.user) {
        console.error('No user returned from login');
        return false;
      }

      // Verify admin role
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, email, role, full_name')
        .eq('id', data.user.id)
        .single();

      console.log('User data after login:', userData, 'Error:', userError);

      if (userError) {
        console.error('Error fetching user data:', userError);
        
        // Try to create user if not exists
        if (userError.code === 'PGRST116') {
          console.log('Creating user profile...');
          
          const { data: newUser, error: createError } = await supabase
            .from('users')
            .insert({
              id: data.user.id,
              email: data.user.email!,
              full_name: data.user.email!.split('@')[0],
              role: 'user',
            })
            .select()
            .single();

          if (createError) {
            console.error('Failed to create user:', createError);
            await supabase.auth.signOut();
            return false;
          }

          console.warn('User created but not admin');
        }
        
        await supabase.auth.signOut();
        return false;
      }

      if (userData?.role !== 'admin') {
        console.error('User is not an admin, role:', userData?.role);
        await supabase.auth.signOut();
        return false;
      }

      console.log('Admin login successful');
      setUser(data.user);
      return true;
    } catch (error) {
      console.error('Login exception:', error);
      return false;
    } finally {
      setLoading(false);
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
    <AdminAuthContext.Provider value={{ user, loading,isAuthenticated: !!user, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return context;
}
